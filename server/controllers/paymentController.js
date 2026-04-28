const crypto = require('crypto');
const { Op } = require('sequelize');
const { Payment, Booking, Trip, Driver, Vehicle, User } = require('../models');

const fetchFn = global.fetch
    ? global.fetch.bind(global)
    : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1226084';
const SECRET = process.env.PAYHERE_SECRET || 'MjcxMDA1MTwzNTg0NTzE5Mzk3NTc3MDMzNzMyOTI3MzcyOTE3NQ==';
const PAYHERE_APP_ID = process.env.PAYHERE_APP_ID || '';
const PAYHERE_APP_SECRET = process.env.PAYHERE_APP_SECRET || '';
const PAYHERE_BASE_URL = process.env.PAYHERE_SANDBOX === 'false'
    ? 'https://www.payhere.lk'
    : 'https://sandbox.payhere.lk';

const getOwnedBooking = async (bookingId, userId) => Booking.findByPk(bookingId, {
    include: [
        { model: Trip },
        { model: Vehicle },
        { model: Driver, attributes: ['name', 'phone'] }
    ]
});

const ensureUserOwnsBooking = (booking, userId) => booking && booking.Trip && booking.Trip.user_id == userId;

const loadOwnedPayment = async (paymentId, userId) => Payment.findByPk(paymentId, {
    include: [{
        model: Booking,
        include: [
            { model: Trip },
            { model: Vehicle },
            { model: Driver, attributes: ['name', 'phone'] }
        ]
    }]
});

const parseSelectedAddons = (selectedAddons) => {
    if (!selectedAddons) return [];
    if (Array.isArray(selectedAddons)) return selectedAddons;

    try {
        const parsed = JSON.parse(selectedAddons);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const getPayHereAccessToken = async () => {
    if (!PAYHERE_APP_ID || !PAYHERE_APP_SECRET) {
        throw new Error('PayHere refund credentials are missing. Set PAYHERE_APP_ID and PAYHERE_APP_SECRET.');
    }

    const authCode = Buffer.from(`${PAYHERE_APP_ID}:${PAYHERE_APP_SECRET}`).toString('base64');
    const response = await fetchFn(`${PAYHERE_BASE_URL}/merchant/v1/oauth/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authCode}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
        throw new Error(data.error_description || data.msg || 'Unable to get PayHere access token.');
    }

    return data.access_token;
};

const resolveGatewayPaymentId = async (payment) => {
    if (payment.transaction_id && /^\d+$/.test(String(payment.transaction_id))) {
        return String(payment.transaction_id);
    }

    const accessToken = await getPayHereAccessToken();
    const orderId = `BOOKING_${payment.booking_id}`;
    const response = await fetchFn(`${PAYHERE_BASE_URL}/merchant/v1/payment/search?order_id=${encodeURIComponent(orderId)}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (!response.ok || data.status < 0 || !Array.isArray(data.data) || data.data.length === 0) {
        const retrievalMessage = data.error_description || data.error || data.msg || 'Unable to retrieve PayHere payment details for refund.';
        if (response.status === 403 || data.error === 'access_denied') {
            throw new Error('PayHere denied access to the Retrieval API. For localhost testing, use a public notify URL such as ngrok so your backend can store the real PayHere payment_id, or update the PayHere API key/domain setup.');
        }
        throw new Error(retrievalMessage);
    }

    const latestPayment = data.data[data.data.length - 1];
    const gatewayPaymentId = latestPayment.payment_id ? String(latestPayment.payment_id) : null;
    if (!gatewayPaymentId) {
        throw new Error('PayHere payment id was not found for this transaction.');
    }

    await payment.update({
        transaction_id: gatewayPaymentId,
        payment_method: latestPayment.payment_method?.method || payment.payment_method || payment.method,
        gateway_response: JSON.stringify(latestPayment)
    });

    return gatewayPaymentId;
};

const escapePdfText = (value) => String(value ?? '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const wrapPdfText = (value, maxChars = 46) => {
    const words = String(value ?? '').split(/\s+/).filter(Boolean);
    if (words.length === 0) return ['-'];

    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;
        if (nextLine.length <= maxChars) {
            currentLine = nextLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
};

const pdfColor = ([r, g, b]) => `${r} ${g} ${b}`;

const buildReceiptPdf = (payment) => {
    const travelerName = payment.Booking?.Trip?.User?.name || 'Traveler';
    const travelerEmail = payment.Booking?.Trip?.User?.email || '-';
    const vehicleName = payment.Booking?.Vehicle?.type || 'Trip Reservation';
    const driverName = payment.Booking?.Driver?.name || 'Assigned Driver';
    const transactionId = payment.transaction_id || `PAY-${payment.id}`;
    const status = String(payment.status || 'completed').toUpperCase();
    const amount = `LKR ${Number(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const createdAt = new Date(payment.createdAt);
    const receiptDate = new Date().toLocaleDateString('en-CA');
    const addons = parseSelectedAddons(payment.selected_addons);
    const refundReason = payment.refund_reason || 'No refund requested';
    const notes = payment.status === 'refunded'
        ? `Refund reference ${payment.refund_id || '-'} recorded on ${payment.refunded_at ? new Date(payment.refunded_at).toLocaleDateString('en-CA') : 'N/A'}.`
        : 'This receipt confirms the recorded transaction for your booking.';

    const commands = [];
    const addRect = (x, y, width, height, fillColor, strokeColor = null, lineWidth = 1) => {
        commands.push('q');
        if (fillColor) commands.push(`${pdfColor(fillColor)} rg`);
        if (strokeColor) {
            commands.push(`${lineWidth} w`);
            commands.push(`${pdfColor(strokeColor)} RG`);
        }
        commands.push(`${x} ${y} ${width} ${height} re`);
        if (fillColor && strokeColor) commands.push('B');
        else if (fillColor) commands.push('f');
        else if (strokeColor) commands.push('S');
        commands.push('Q');
    };
    const addLine = (x1, y1, x2, y2, color, lineWidth = 1) => {
        commands.push('q');
        commands.push(`${lineWidth} w`);
        commands.push(`${pdfColor(color)} RG`);
        commands.push(`${x1} ${y1} m ${x2} ${y2} l S`);
        commands.push('Q');
    };
    const addText = (text, x, y, size = 12, font = 'F1', color = [0, 0, 0]) => {
        commands.push('BT');
        commands.push(`/${font} ${size} Tf`);
        commands.push(`${pdfColor(color)} rg`);
        commands.push(`1 0 0 1 ${x} ${y} Tm`);
        commands.push(`(${escapePdfText(text)}) Tj`);
        commands.push('ET');
    };

    addRect(0, 0, 595, 842, [0.98, 0.99, 0.98]);
    addRect(0, 690, 595, 152, [0.05, 0.41, 0.24]);
    addRect(42, 640, 511, 38, [0.93, 0.97, 0.95]);

    addText('Suranga Tours', 46, 792, 24, 'F2', [1, 1, 1]);
    addText('Official Payment Receipt', 46, 768, 13, 'F1', [0.87, 0.95, 0.9]);
    addText(`Generated on ${receiptDate}`, 420, 792, 11, 'F1', [0.87, 0.95, 0.9]);
    addText(`Receipt # ${payment.id}`, 420, 772, 13, 'F2', [1, 1, 1]);
    addText('Secure itinerary and transport booking summary', 46, 654, 11, 'F1', [0.18, 0.28, 0.22]);

    addRect(42, 560, 245, 68, [1, 1, 1], [0.84, 0.9, 0.86]);
    addRect(308, 560, 245, 68, [1, 1, 1], [0.84, 0.9, 0.86]);
    addText('Traveler', 58, 606, 10, 'F2', [0.22, 0.34, 0.27]);
    addText(travelerName, 58, 584, 15, 'F2', [0.06, 0.12, 0.08]);
    addText(travelerEmail, 58, 566, 10, 'F1', [0.35, 0.42, 0.38]);
    addText('Transaction', 324, 606, 10, 'F2', [0.22, 0.34, 0.27]);
    addText(transactionId, 324, 584, 15, 'F2', [0.06, 0.12, 0.08]);
    addText(`Status: ${status}`, 324, 566, 10, 'F1', payment.status === 'refunded' ? [0.11, 0.31, 0.84] : [0.02, 0.43, 0.27]);

    addText('Booking Overview', 42, 530, 14, 'F2', [0.08, 0.18, 0.11]);
    addLine(42, 522, 553, 522, [0.78, 0.85, 0.8], 1);

    const detailRows = [
        ['Booking ID', `#${payment.booking_id}`],
        ['Vehicle', vehicleName],
        ['Driver', driverName],
        ['Payment Method', payment.payment_method || payment.method || 'card'],
        ['Created At', createdAt.toLocaleString('en-CA')],
        ['Refund ID', payment.refund_id || '-']
    ];

    let detailY = 492;
    detailRows.forEach(([label, value], index) => {
        const leftColumn = index < 3;
        const x = leftColumn ? 42 : 308;
        const y = leftColumn ? detailY - (index * 54) : detailY - ((index - 3) * 54);
        addText(label, x, y, 10, 'F2', [0.35, 0.42, 0.38]);
        wrapPdfText(value, 28).forEach((line, lineIndex) => {
            addText(line, x, y - 18 - (lineIndex * 14), 11, 'F1', [0.08, 0.18, 0.11]);
        });
    });

    addRect(42, 230, 511, 118, [1, 1, 1], [0.84, 0.9, 0.86]);
    addText('Charge Summary', 58, 320, 14, 'F2', [0.08, 0.18, 0.11]);
    addText('Recorded Amount', 58, 288, 10, 'F2', [0.35, 0.42, 0.38]);
    addText(amount, 58, 266, 20, 'F2', [0.05, 0.41, 0.24]);
    addText('Selected Add-ons', 308, 288, 10, 'F2', [0.35, 0.42, 0.38]);
    wrapPdfText(addons.length > 0 ? addons.join(', ') : 'No add-ons selected', 30).forEach((line, index) => {
        addText(line, 308, 266 - (index * 14), 11, 'F1', [0.08, 0.18, 0.11]);
    });

    addRect(42, 92, 511, 110, [0.96, 0.98, 0.97], [0.84, 0.9, 0.86]);
    addText('Notes', 58, 174, 14, 'F2', [0.08, 0.18, 0.11]);
    [...wrapPdfText(notes, 78), ...wrapPdfText(`Refund Reason: ${refundReason}`, 78)].slice(0, 5).forEach((line, index) => {
        addText(line, 58, 148 - (index * 16), 11, 'F1', [0.2, 0.28, 0.23]);
    });

    addText('Thank you for choosing Suranga Tours.', 42, 52, 11, 'F2', [0.08, 0.18, 0.11]);
    addText('This receipt was generated digitally and is valid without a signature.', 42, 34, 9, 'F1', [0.36, 0.43, 0.39]);

    const stream = commands.join('\n');
    const objects = [
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
        '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj',
        `4 0 obj << /Length ${Buffer.byteLength(stream, 'utf8')} >> stream\n${stream}\nendstream endobj`,
        '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
        '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj'
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object) => {
        offsets.push(Buffer.byteLength(pdf, 'utf8'));
        pdf += `${object}\n`;
    });

    const xrefOffset = Buffer.byteLength(pdf, 'utf8');
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(pdf, 'utf8');
};

const buildPaymentInclude = () => ([
    {
        model: Booking,
        include: [
            {
                model: Trip,
                include: [{ model: User, attributes: ['name', 'email'] }]
            },
            { model: Vehicle },
            { model: Driver, attributes: ['name', 'phone'] }
        ]
    }
]);

const normalizeGatewayPaymentId = (value) => (/^\d+$/.test(String(value || '')) ? String(value) : null);

const getRefundRestrictionMessage = (payment) => {
    const tripStartDate = payment?.Booking?.Trip?.start_date ? new Date(payment.Booking.Trip.start_date) : null;
    if (!tripStartDate || Number.isNaN(tripStartDate.getTime())) return null;

    const hoursUntilTrip = (tripStartDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilTrip < 48) {
        return 'Your trip starts in less than 48 hours. Our policy does not allow refunds within 48 hours of the trip start date.';
    }

    return null;
};

const serializePayment = (payment) => ({
    ...payment.toJSON(),
    selected_addons: parseSelectedAddons(payment.selected_addons)
});

const generatePaymentHash = async (req, res) => {
    try {
        const { order_id, amount, currency } = req.body;
        const formattedAmount = parseFloat(amount).toFixed(2);
        const hashedSecret = crypto.createHash('md5').update(SECRET).digest('hex').toUpperCase();
        const stringToHash = MERCHANT_ID + order_id + formattedAmount + currency + hashedSecret;
        const hash = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

        res.json({
            merchant_id: MERCHANT_ID,
            hash,
            formattedAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating hash', error: error.message });
    }
};

const payhereNotify = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send('Notify payload missing');
        }

        const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig, method } = req.body;
        const hashedSecret = crypto.createHash('md5').update(SECRET).digest('hex').toUpperCase();
        const stringToHash = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
        const localMd5sig = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

        if (localMd5sig !== md5sig) {
            return res.status(400).send('Verification Failed');
        }

        if (String(status_code) !== '2') {
            return res.status(400).send('Payment not successful');
        }

        let bookingId = null;
        if (order_id.startsWith('BOOKING_')) {
            bookingId = parseInt(order_id.split('_')[1], 10);
        }

        if (!bookingId) {
            return res.status(400).send('Invalid booking order');
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        await Booking.update({ status: 'completed' }, { where: { id: bookingId } });
        await Trip.update({ status: 'paid' }, { where: { id: booking.trip_id } });
        await Payment.destroy({
            where: {
                booking_id: bookingId,
                status: { [Op.in]: ['draft', 'pending'] }
            }
        });

        const normalizedPaymentId = normalizeGatewayPaymentId(payment_id);
        const exactPayment = normalizedPaymentId ? await Payment.findOne({
            where: {
                booking_id: bookingId,
                status: 'completed',
                transaction_id: normalizedPaymentId
            }
        }) : null;

        if (exactPayment) {
            await exactPayment.update({
                amount: payhere_amount,
                currency: payhere_currency || 'LKR',
                payment_method: method || exactPayment.payment_method || 'card',
                method: 'card',
                gateway_response: JSON.stringify(req.body)
            });
        } else {
            const existingPlaceholder = await Payment.findOne({
                where: {
                    booking_id: bookingId,
                    status: 'completed'
                },
                order: [['createdAt', 'DESC']]
            });

            if (existingPlaceholder) {
                await existingPlaceholder.update({
                    amount: payhere_amount,
                    currency: payhere_currency || 'LKR',
                    transaction_id: normalizedPaymentId,
                    payment_method: method || existingPlaceholder.payment_method || 'card',
                    method: 'card',
                    gateway: 'payhere',
                    gateway_response: JSON.stringify(req.body)
                });
            } else {
            await Payment.create({
                booking_id: bookingId,
                amount: payhere_amount,
                currency: payhere_currency || 'LKR',
                status: 'completed',
                transaction_id: normalizedPaymentId,
                payment_method: method || 'card',
                method: 'card',
                gateway: 'payhere',
                gateway_response: JSON.stringify(req.body)
            });
            }
        }

        return res.status(200).send('OK');
    } catch (error) {
        console.error('PayHere Notify Error:', error);
        return res.status(500).send('Server Error');
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: buildPaymentInclude(),
            order: [['createdAt', 'DESC']]
        });

        res.json(payments.map(serializePayment));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all payments', error: error.message });
    }
};

const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [{
                model: Booking,
                include: [
                    {
                        model: Trip,
                        where: { user_id: req.user.id }
                    },
                    { model: Vehicle },
                    { model: Driver, attributes: ['name', 'phone'] }
                ]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(payments.map(serializePayment));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
};

const getPaymentDetails = async (req, res) => {
    try {
        const payment = await loadOwnedPayment(req.params.id, req.user.id);

        if (!payment || !payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.json(serializePayment(payment));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment detail', error: error.message });
    }
};

const saveDraftPayment = async (req, res) => {
    try {
        const { booking_id, selected_addons = [], amount } = req.body;
        const booking = await getOwnedBooking(booking_id, req.user.id);

        if (!ensureUserOwnsBooking(booking, req.user.id)) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const existingDraft = await Payment.findOne({
            where: {
                booking_id,
                status: { [Op.in]: ['draft', 'pending'] }
            },
            order: [['updatedAt', 'DESC']]
        });

        const payload = {
            booking_id,
            amount,
            currency: 'LKR',
            status: 'draft',
            selected_addons: JSON.stringify(selected_addons),
            payment_method: 'card',
            method: 'card',
            gateway: 'payhere'
        };

        const payment = existingDraft
            ? await existingDraft.update(payload)
            : await Payment.create(payload);

        const refreshedPayment = await loadOwnedPayment(payment.id, req.user.id);
        res.json(serializePayment(refreshedPayment));
    } catch (error) {
        res.status(500).json({ message: 'Error saving draft', error: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const { status, selected_addons, amount } = req.body;
        const payment = await loadOwnedPayment(req.params.id, req.user.id);

        if (!payment || !payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        if (payment.status === 'completed' || payment.status === 'refunded') {
            return res.status(400).json({ message: 'Cannot modify this payment record' });
        }

        await payment.update({
            status: status || 'draft',
            selected_addons: selected_addons ? JSON.stringify(selected_addons) : payment.selected_addons,
            amount: amount || payment.amount
        });

        const refreshedPayment = await loadOwnedPayment(payment.id, req.user.id);
        res.json(serializePayment(refreshedPayment));
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};

const deletePayment = async (req, res) => {
    try {
        const payment = await loadOwnedPayment(req.params.id, req.user.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        if (req.user.role !== 'admin') {
            if (!payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            if (payment.status !== 'draft' && payment.status !== 'pending') {
                return res.status(400).json({ message: 'Can only delete draft or pending payments' });
            }
        }

        await payment.destroy();
        res.json({ message: 'Payment record removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
};

const confirmPaymentSuccess = async (req, res) => {
    try {
        const { booking_id, amount, transaction_id, payment_method, selected_addons = [] } = req.body;
        const booking = await Booking.findByPk(booking_id, {
            include: [{ model: Trip }]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.Trip.user_id != req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Trip.update({ status: 'paid' }, { where: { id: booking.trip_id } });
        await Booking.update({ status: 'completed' }, { where: { id: booking_id } });
        await Payment.destroy({
            where: {
                booking_id,
                status: { [Op.in]: ['draft', 'pending'] }
            }
        });

        const normalizedPaymentId = normalizeGatewayPaymentId(transaction_id);
        const existingPayment = await Payment.findOne({
            where: {
                booking_id,
                status: 'completed',
                transaction_id: normalizedPaymentId
            }
        });

        if (!existingPayment) {
            await Payment.create({
                booking_id,
                amount: amount || 0,
                currency: 'LKR',
                status: 'completed',
                transaction_id: normalizedPaymentId,
                payment_method: payment_method || 'card',
                method: 'card',
                gateway: 'payhere',
                selected_addons: JSON.stringify(selected_addons)
            });
        }

        res.json({ message: 'Payment confirmed successfully', status: 'paid' });
    } catch (error) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({ message: 'Error confirming payment', error: error.message });
    }
};

const downloadPaymentReceiptPdf = async (req, res) => {
    try {
        const payment = await loadOwnedPayment(req.params.id, req.user.id);

        if (!payment || !payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        const pdfBuffer = buildReceiptPdf(payment);
        res.json({
            fileName: `transaction-${payment.id}.pdf`,
            mimeType: 'application/pdf',
            pdfBase64: pdfBuffer.toString('base64')
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating receipt PDF', error: error.message });
    }
};

const refundPayment = async (req, res) => {
    try {
        const { reason, payment_id_override } = req.body;
        const payment = await loadOwnedPayment(req.params.id, req.user.id);

        if (!payment || !payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({ message: 'Only completed payments can be refunded.' });
        }

        const refundRestrictionMessage = getRefundRestrictionMessage(payment);
        if (refundRestrictionMessage) {
            return res.status(400).json({ message: refundRestrictionMessage });
        }

        const effectiveMethod = String(payment.payment_method || payment.method || '').toLowerCase();
        if (!effectiveMethod.includes('card') && !['visa', 'mastercard', 'amex', 'discover', 'diners'].some((cardType) => effectiveMethod.includes(cardType))) {
            return res.status(400).json({ message: 'PayHere can refund only card payments automatically.' });
        }

        let gatewayPaymentId = null;
        if (payment_id_override && /^\d+$/.test(String(payment_id_override))) {
            gatewayPaymentId = String(payment_id_override);
            if (payment.transaction_id !== gatewayPaymentId) {
                await payment.update({ transaction_id: gatewayPaymentId });
            }
        } else {
            gatewayPaymentId = await resolveGatewayPaymentId(payment);
        }

        const accessToken = await getPayHereAccessToken();
        const response = await fetchFn(`${PAYHERE_BASE_URL}/merchant/v1/payment/refund`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment_id: gatewayPaymentId,
                description: reason || 'Customer requested refund'
            })
        });

        const data = await response.json();
        if (!response.ok || data.status !== 1) {
            return res.status(400).json({
                message: data.msg || 'Refund request failed at PayHere. Please verify the PayHere payment ID and try again.',
                payhere: data,
                requires_payment_id: !payment_id_override && !/^\d+$/.test(String(payment.transaction_id || ''))
            });
        }

        await payment.update({
            status: 'refunded',
            refund_id: data.data ? String(data.data) : null,
            refund_reason: reason || 'Customer requested refund',
            refunded_at: new Date(),
            gateway_response: JSON.stringify(data)
        });

        const refreshedPayment = await loadOwnedPayment(payment.id, req.user.id);
        res.json(serializePayment(refreshedPayment));
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error refunding payment', error: error.message });
    }
};

module.exports = {
    generatePaymentHash,
    payhereNotify,
    confirmPaymentSuccess,
    getAllPayments,
    getMyPayments,
    getPaymentDetails,
    saveDraftPayment,
    updatePayment,
    deletePayment,
    downloadPaymentReceiptPdf,
    refundPayment
};

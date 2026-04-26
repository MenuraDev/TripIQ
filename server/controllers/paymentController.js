const crypto = require('crypto');
const { Payment, Booking, Trip, Driver, Vehicle, User } = require('../models');

// Add your PayHere credentials (in production, use environment variables)
const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1226084'; // Sandbox testing merchant ID
const SECRET = process.env.PAYHERE_SECRET || 'MjcxMDA1MTwzNTg0NTzE5Mzk3NTc3MDMzNzMyOTI3MzcyOTE3NQ==';

// @desc    Generate hash for PayHere
// @route   POST /api/payments/hash
// @access  Tourist (or Private)
const generatePaymentHash = async (req, res) => {
    try {
        const { order_id, amount, currency } = req.body;

        // PayHere Hash generation logic updated tp match their latest requirements:
        // md5sig = MD5 (merchant_id + order_id + amount_formatted + currency + MD5(merchant_secret))
        // amount must be formatted to two decimal places
        const formattedAmount = parseFloat(amount).toFixed(2);

        const hashedSecret = crypto.createHash('md5').update(SECRET).digest('hex').toUpperCase();

        const stringToHash = MERCHANT_ID + order_id + formattedAmount + currency + hashedSecret;
        const hash = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

        res.json({
            merchant_id: MERCHANT_ID,
            hash: hash,
            formattedAmount: formattedAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating hash', error: error.message });
    }
};

// @desc    Handle PayHere server-to-server notification
// @route   POST /api/payments/notify
// @access  Public (Called by PayHere)
const payhereNotify = async (req, res) => {
    try {
        const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

        const hashedSecret = crypto.createHash('md5').update(SECRET).digest('hex').toUpperCase();
        const stringToHash = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
        const localMd5sig = crypto.createHash('md5').update(stringToHash).digest('hex').toUpperCase();

        if (localMd5sig === md5sig) {
            // Valid notification
            if (status_code == 2) {
                // Payment Success
                let bookingId = null;
                let tripId = null;

                // Assuming order_id format is "BOOKING_123" or "TRIP_456"
                if (order_id.startsWith('BOOKING_')) {
                    bookingId = order_id.split('_')[1];
                    // Update Booking Status
                    await Booking.update({ status: 'completed' }, { where: { id: bookingId } });

                    // NEW: Update associated Trip status to 'paid'
                    const booking = await Booking.findByPk(bookingId);
                    if (booking) {
                        await Trip.update({ status: 'paid' }, { where: { id: booking.trip_id } });
                    }

                    // NEW: Delete any existing draft/pending payments for this booking
                    await Payment.destroy({
                        where: {
                            booking_id: bookingId,
                            status: ['draft', 'pending']
                        }
                    });
                } else if (order_id.startsWith('TRIP_')) {
                    tripId = order_id.split('_')[1];
                    // Update Trip Status if applicable
                    await Trip.update({ status: 'confirmed' }, { where: { id: tripId } });
                }

                // Record the payment 
                await Payment.create({
                    booking_id: bookingId,
                    amount: payhere_amount,
                    status: 'completed',
                    transaction_id: req.body.payment_id || 'PH_' + Date.now(), // PayHere payment ID
                    payment_method: req.body.method || 'card'
                });

                return res.status(200).send('OK');
            } else {
                // Payment Failed/Pending/Canceled
                return res.status(400).send('Payment not successful');
            }
        } else {
            return res.status(400).send('Verification Failed');
        }
    } catch (error) {
        console.error('PayHere Notify Error:', error);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all payments (Admin only payments)
// @route   GET /api/payments
// @access  Admin
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                {
                    model: Booking,
                    include: [
                        { model: Trip, include: [{ model: User, attributes: ['name', 'email'] }] },
                        { model: Vehicle },
                        { model: Driver, attributes: ['name'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all payments', error: error.message });
    }
};

// @desc    Get all payments for logged-in tourist
// @route   GET /api/payments/my
// @access  Tourist
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                {
                    model: Booking,
                    include: [
                        {
                            model: Trip,
                            where: { user_id: req.user.id }
                        },
                        { model: Vehicle },
                        { model: Driver, attributes: ['name', 'phone'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
};

// @desc    Get single payment detail
// @route   GET /api/payments/:id
// @access  Tourist
/*const getPaymentDetails = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id, {
            include: [
                {
                    model: Booking,
                    include: [
                        { model: Trip },
                        { model: Vehicle },
                        { model: Driver, attributes: ['name', 'phone'] }
                    ]
                }
            ]
        });

        if (!payment || !payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment detail', error: error.message });
    }
};
*/

// @desc    Update payment status or add-ons (Save as Draft method)
// @route   PUT /api/payments/:id
// @access  Tourist
const updatePayment = async (req, res) => {
    try {
        const { status, selected_addons, amount } = req.body;
        const payment = await Payment.findByPk(req.params.id, {
            include: [{ model: Booking, include: [{ model: Trip }] }]
        });

        if (!payment || !payment.Booking || !payment.Booking.Trip || payment.Booking.Trip.user_id != req.user.id) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        if (payment.status === 'completed') {
            return res.status(400).json({ message: 'Cannot modify a completed payment' });
        }

        await payment.update({
            status: status || payment.status,
            selected_addons: selected_addons ? JSON.stringify(selected_addons) : payment.selected_addons,
            amount: amount || payment.amount
        });

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};

// @desc    Delete a payment record (Draft only for users)
// @route   DELETE /api/payments/:id
// @access  Tourist
const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id, {
            include: [{ model: Booking, include: [{ model: Trip }] }]
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        // Users can only delete drafts. Admins can delete anything.
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

// @desc    Confirm payment success from client (Fallback for local dev)
// @route   POST /api/payments/confirm
// @access  Tourist
const confirmPaymentSuccess = async (req, res) => {
    try {
        const { booking_id, amount, transaction_id, payment_method } = req.body;

        const booking = await Booking.findByPk(booking_id, {
            include: [{ model: Trip }]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership (using != for type-insensitive comparison as per previous fix)
        if (booking.Trip.user_id != req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // 1. Update Trip status to 'paid'
        await Trip.update({ status: 'paid' }, { where: { id: booking.trip_id } });

        // 2. Update Booking status to 'completed'
        await Booking.update({ status: 'completed' }, { where: { id: booking_id } });

        // 3. Clean up any draft/pending payments
        await Payment.destroy({
            where: {
                booking_id: booking_id,
                status: ['draft', 'pending']
            }
        });

        // 4. Record the completed payment if not already exists
        const existingPayment = await Payment.findOne({
            where: { booking_id, status: 'completed' }
        });

        if (!existingPayment) {
            await Payment.create({
                booking_id: booking_id,
                amount: amount || 0,
                status: 'completed',
                transaction_id: transaction_id || 'PH_CLIENT_' + Date.now(),
                payment_method: payment_method || 'card'
            });
        }

        res.json({ message: 'Payment confirmed successfully', status: 'paid' });
    } catch (error) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({ message: 'Error confirming payment', error: error.message });
    }
}; 

module.exports = {
    generatePaymentHash,
    payhereNotify,
    confirmPaymentSuccess,
    getAllPayments,
    getMyPayments,
    getPaymentDetails,
    updatePayment,
    deletePayment
};

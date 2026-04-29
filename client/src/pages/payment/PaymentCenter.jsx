import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .payment-layout { display: flex; flex-direction: column; min-height: 100vh; width: 100%; background: #F3F4F6; font-family: 'DM Sans', sans-serif; }
  .pc-header { padding: 40px 60px 20px; text-align: left; }
  .pc-title { font-size: 2.5rem; font-weight: 700; color: #111827; }
  .pc-subtitle { color: #6B7280; font-size: 1rem; margin-top: 6px; }
  .pc-tabs { display: flex; gap: 40px; border-bottom: 1px solid #E5E7EB; padding: 0 60px; margin-bottom: 40px; }
  .pc-tab { padding: 16px 0; color: #6B7280; font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.3s; }
  .pc-tab.active { color: #059669; border-bottom-color: #059669; }
  .pc-main { display: grid; grid-template-columns: 65% 35%; gap: 30px; padding: 0 60px 60px; }
  @media (max-width: 900px) { .pc-main { grid-template-columns: 1fr; padding: 0 20px 40px; } .pc-header, .pc-tabs { padding-left: 20px; padding-right: 20px; } }
  .pc-card { background: white; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 30px; border: 1px solid #E5E7EB; }
  .card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; margin-bottom: 20px; }
  .card-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
  .btn-outline { background: white; border: 1px solid #E5E7EB; color: #374151; padding: 10px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .btn-outline:hover { background: #F9FAFB; }
  .btn-primary { background: #059669; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer; width: 100%; font-size: 1.05rem; transition: 0.3s; }
  .btn-primary:hover { background: #047857; }
  .btn-primary:disabled, .btn-outline:disabled { opacity: 0.7; cursor: not-allowed; }
  .section-label { font-size: 0.85rem; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 12px; }
  .info-block { background: #F9FAFB; padding: 16px; border-radius: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .addon-row { display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 12px; cursor: pointer; transition: 0.2s; }
  .addon-row:hover { border-color: #10B981; }
  .addon-row.selected { border-color: #059669; background: #ECFDF5; }
  .cost-row { display: flex; justify-content: space-between; margin-bottom: 16px; color: #374151; font-weight: 500; gap: 16px; }
  .total-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #E5E7EB; padding-top: 20px; margin-top: 20px; margin-bottom: 30px; font-weight: 700; color: #111827; gap: 16px; }
  .total-val { font-size: 2rem; color: #059669; }
  .footer-links { margin-top: 20px; font-size: 0.85rem; color: #6B7280; line-height: 1.7; }
  .footer-link-btn { background: none; border: none; color: #059669; cursor: pointer; font-weight: 700; text-decoration: underline; padding: 0; }
  .table-wrap { border: 1px solid #E5E7EB; borderRadius: 12px; overflow: hidden; }
  .status-pill { font-size: 0.75rem; padding: 6px 10px; border-radius: 999px; font-weight: 700; display: inline-block; }
  .status-pill.completed { background: #ECFDF5; color: #065F46; }
  .status-pill.failed { background: #FEF2F2; color: #991B1B; }
  .status-pill.refunded { background: #EFF6FF; color: #1D4ED8; }
  .status-pill.draft { background: #FEF3C7; color: #92400E; }
  .action-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .modal-backdrop { position: fixed; inset: 0; background: rgba(17,24,39,0.45); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 2000; }
  .modal-card { width: min(820px, 100%); max-height: 85vh; overflow-y: auto; background: white; border-radius: 24px; padding: 30px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); }
  .policy-switcher { display: flex; gap: 10px; margin: 20px 0; }
  .policy-btn { border: 1px solid #D1D5DB; background: #F9FAFB; color: #374151; padding: 10px 16px; border-radius: 999px; cursor: pointer; font-weight: 700; }
  .policy-btn.active { background: #ECFDF5; color: #047857; border-color: #A7F3D0; }
  .policy-shell { text-align: left; }
  .policy-kicker { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #0b6b43; margin-bottom: 10px; }
  .policy-title { font-family: 'Fraunces', serif; font-size: 2rem; line-height: 1.1; color: #102217; margin-bottom: 10px; }
  .policy-intro { font-size: 1rem; line-height: 1.8; color: #4b5563; max-width: 680px; }
  .policy-section-list { display: grid; gap: 16px; margin-top: 24px; }
  .policy-section-card { border: 1px solid #e5ece7; border-radius: 20px; padding: 20px 22px; background: linear-gradient(180deg, #ffffff 0%, #f8fbf9 100%); }
  .policy-section-heading { font-family: 'Fraunces', serif; font-size: 1.2rem; color: #183222; margin-bottom: 10px; }
  .policy-points { display: grid; gap: 10px; }
  .policy-point { position: relative; padding-left: 18px; font-size: 0.96rem; line-height: 1.75; color: #374151; }
  .policy-point::before { content: ''; position: absolute; left: 0; top: 11px; width: 7px; height: 7px; border-radius: 50%; background: #0b6b43; }
  .policy-refund-banner { margin-top: 18px; padding: 16px 18px; border-radius: 18px; background: linear-gradient(135deg, #fff8eb 0%, #fff3d5 100%); border: 1px solid #f5d58c; text-align: left; }
  .policy-refund-banner-title { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #92400e; margin-bottom: 8px; }
  .policy-refund-banner-text { font-size: 0.95rem; line-height: 1.7; color: #7c2d12; }
  .payment-policy-card { margin-top: 18px; padding: 18px; border-radius: 18px; background: linear-gradient(180deg, #f8fcf9 0%, #eff8f2 100%); border: 1px solid #dcebdd; text-align: left; }
  .payment-policy-heading { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #0b6b43; margin-bottom: 8px; }
  .payment-policy-text { font-size: 0.93rem; line-height: 1.7; color: #425466; }
  .payment-policy-links { margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; }
  .draft-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .draft-card { background: linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%); border-radius: 24px; border: 1px solid #dbe8df; overflow: hidden; box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06); display: flex; flex-direction: column; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
  .draft-card:hover { transform: translateY(-6px); box-shadow: 0 26px 54px rgba(15, 23, 42, 0.11); border-color: #b8d5c0; }
  .draft-media { position: relative; height: 170px; overflow: hidden; background: linear-gradient(135deg, #dcefe2 0%, #b7d8c1 100%); }
  .draft-media img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.01); }
  .draft-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.12) 48%, rgba(15, 23, 42, 0)); }
  .draft-chip-row { position: absolute; top: 14px; left: 14px; right: 14px; display: flex; justify-content: space-between; align-items: center; z-index: 1; gap: 10px; }
  .draft-status-chip { padding: 6px 12px; border-radius: 999px; background: rgba(254, 243, 199, 0.92); color: #92400e; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; backdrop-filter: blur(8px); }
  .draft-booking-chip { padding: 6px 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.18); color: #ffffff; font-size: 0.74rem; font-weight: 700; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.24); }
  .draft-image-caption { position: absolute; left: 16px; right: 16px; bottom: 14px; z-index: 1; color: white; text-align: left; }
  .draft-image-caption h4 { font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; line-height: 1.15; }
  .draft-image-caption p { font-size: 0.84rem; color: rgba(255,255,255,0.84); }
  .draft-content { padding: 18px; display: flex; flex-direction: column; flex: 1; gap: 14px; text-align: left; align-items: stretch; }
  .draft-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .draft-meta-item { background: #f6faf7; border: 1px solid #e1ece5; border-radius: 16px; padding: 12px; text-align: left; }
  .draft-meta-label { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280; margin-bottom: 7px; }
  .draft-meta-value { font-size: 0.9rem; font-weight: 700; color: #111827; line-height: 1.35; text-align: left; }
  .draft-price-panel { margin-top: auto; background: linear-gradient(135deg, #0f5132 0%, #0b6b43 100%); color: white; border-radius: 18px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: end; gap: 14px; text-align: left; }
  .draft-price-label { font-size: 0.74rem; font-weight: 700; color: rgba(255,255,255,0.78); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .draft-price-value { font-size: 1.55rem; font-weight: 800; line-height: 1; }
  .draft-price-note { font-size: 0.86rem; color: rgba(255,255,255,0.84); text-align: left; }
  .draft-footer { margin-top: 2px; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding-top: 4px; }
  .draft-footer-note { font-size: 0.82rem; color: #6b7280; text-align: left; }
  .draft-action-row { display: flex; gap: 10px; }
  .draft-action-row .btn-primary { flex: 1; }
  .draft-delete-btn { padding: 0 18px; border-radius: 12px; border: 1px solid #fecaca; background: #fff5f5; color: #dc2626; font-weight: 700; cursor: pointer; }
  .draft-empty-state { border: 1px dashed #cddfcf; border-radius: 28px; background: linear-gradient(180deg, #fcfefc 0%, #f6fbf7 100%); padding: 56px 28px; text-align: center; color: #6b7280; }
  .draft-empty-state h3 { font-size: 1.2rem; color: #1f2937; margin: 14px 0 8px; }
`;

const ADDON_OPTIONS = [
    { id: 'driver', name: 'Professional Driver', price: 5000, selected: false },
    { id: 'insurance', name: 'Extra Insurance', price: 2500, selected: false },
    { id: 'gps', name: 'GPS Device', price: 1000, selected: false }
];

const REFUND_WINDOW_MESSAGE = 'Your trip starts in less than 48 hours. Our policy does not allow refunds within 48 hours of the trip start date.';

const POLICY_CONTENT = {
    terms: {
        title: 'Terms & Conditions',
        intro: 'These terms outline how payment records, booking confirmation, and payment-center activity are handled during checkout and post-payment support.',
        sections: [
            {
                heading: 'Reservation Confirmation',
                points: [
                    'A trip reservation becomes financially confirmed only after a successful payment has been recorded against the booking.',
                    'Saved drafts help preserve your current selections, but they do not permanently reserve the vehicle until checkout is completed.'
                ]
            },
            {
                heading: 'Saved Drafts',
                points: [
                    'A saved draft stores the latest selected add-ons and the calculated payable amount for a booking.',
                    'Once a payment is completed successfully, the corresponding draft is removed automatically from the draft list.'
                ]
            },
            {
                heading: 'Transaction Records',
                points: [
                    'Completed and refunded payments are retained in transaction history for operational review and customer support.',
                    'Receipt documents generated from the system reflect the transaction state available at the time of download.'
                ]
            }
        ]
    },
    privacy: {
        title: 'Privacy Policy',
        intro: 'Payment-related information is handled only to the extent required to process bookings, maintain transaction records, and support legitimate refund requests.',
        sections: [
            {
                heading: 'Information We Process',
                points: [
                    'Booking details, traveler information, selected vehicle details, and payment summary information are used to complete your travel reservation.',
                    'Payment card information is processed by PayHere and is not stored directly in your local application database.'
                ]
            },
            {
                heading: 'Stored Payment Metadata',
                points: [
                    'The system may store transaction identifiers, payment status, refund references, and timestamps required for payment tracking and audit history.',
                    'Generated PDFs include booking and payment summary information only.'
                ]
            },
            {
                heading: 'Operational Use',
                points: [
                    'Refund reasons and policy decisions may be retained for support, dispute handling, and financial reporting.',
                    'Access to payment records should remain restricted to the traveler and authorized administrators.'
                ]
            }
        ]
    },
    refund: {
        title: 'Refund Policy',
        intro: 'Refunds are handled against completed card transactions and are subject to booking timing, payment verification, and operational restrictions.',
        sections: [
            {
                heading: 'Eligibility',
                points: [
                    'Refunds are available only for completed payments that can be matched to a valid PayHere transaction.',
                    'Draft payments and failed transactions cannot be refunded because no completed charge exists against the booking.'
                ]
            },
            {
                heading: 'Time Restriction',
                points: [
                    REFUND_WINDOW_MESSAGE,
                    'If the booking falls inside the restricted period, the system will block the refund request automatically.'
                ]
            },
            {
                heading: 'Processing Notes',
                points: [
                    'Approved refunds are recorded with a refund reason, refund reference, and updated transaction status.',
                    'Final refund settlement time depends on PayHere and the original card provider.'
                ]
            }
        ]
    }
};

const isRefundBlockedByWindow = (payment) => {
    const tripStartDate = payment?.Booking?.Trip?.start_date ? new Date(payment.Booking.Trip.start_date) : null;
    if (!tripStartDate || Number.isNaN(tripStartDate.getTime())) return false;

    const hoursUntilTrip = (tripStartDate.getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntilTrip < 48;
};

const getRefundPolicySummary = (payment) => (
    isRefundBlockedByWindow(payment)
        ? REFUND_WINDOW_MESSAGE
        : 'Refunds are available for completed card payments only and are still subject to transaction verification and policy review.'
);

export default function PaymentCenter() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const assetBaseUrl = process.env.REACT_APP_ASSET_BASE_URL || apiBaseUrl;
    const publicAppUrl = process.env.REACT_APP_PUBLIC_APP_URL || window.location.origin;
    const publicBackendUrl = process.env.REACT_APP_PUBLIC_BACKEND_URL || apiBaseUrl;
    const payHereReturnUrl = `${publicAppUrl.replace(/\/$/, '')}/user-dashboard`;
    const payHereCancelUrl = `${publicAppUrl.replace(/\/$/, '')}/user-dashboard`;
    const payHereNotifyUrl = `${publicBackendUrl.replace(/\/$/, '')}/api/payments/notify`;

    const [activeTab, setActiveTab] = useState('Payment Portal');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentRecord, setPaymentRecord] = useState(null);
    const [savedDrafts, setSavedDrafts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [addons, setAddons] = useState(ADDON_OPTIONS);
    const [loading, setLoading] = useState(true);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [policyModalOpen, setPolicyModalOpen] = useState(false);
    const [policyView, setPolicyView] = useState('terms');

    const token = storedUser.token;

    const calculateTotal = useMemo(() => {
        const baseCost = Number(bookingDetails?.Trip?.total_cost || 0);
        const addonTotal = addons.filter((addon) => addon.selected).reduce((sum, addon) => sum + addon.price, 0);
        const subtotal = baseCost + addonTotal;
        const tax = subtotal * 0.05;
        return {
            baseCost,
            addonTotal,
            tax,
            grandTotal: subtotal + tax,
            totalWithDeposit: subtotal + tax + 10000
        };
    }, [addons, bookingDetails]);

    const loadPaymentState = useCallback(async () => {
        const paymentsRes = await fetch(`${apiBaseUrl}/api/payments/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const payments = paymentsRes.ok ? await paymentsRes.json() : [];
        const drafts = payments.filter((payment) => payment.status === 'draft' || payment.status === 'pending');
        const history = payments.filter((payment) => ['completed', 'failed', 'refunded'].includes(payment.status));
        const currentDraft = drafts.find((payment) => payment.booking_id === Number(bookingId)) || null;

        setSavedDrafts(drafts);
        setTransactions(history);
        setPaymentRecord(currentDraft);

        const selectedIds = currentDraft?.selected_addons || [];
        setAddons(ADDON_OPTIONS.map((addon) => ({
            ...addon,
            selected: selectedIds.includes(addon.id)
        })));
    }, [apiBaseUrl, bookingId, token]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                if (bookingId) {
                    const bookingRes = await fetch(`${apiBaseUrl}/api/bookings/${bookingId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (bookingRes.ok) {
                        setBookingDetails(await bookingRes.json());
                    }
                }

                await loadPaymentState();
            } catch (error) {
                console.error('Error fetching payment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiBaseUrl, bookingId, token, navigate, loadPaymentState]);

    const handleAddonToggle = (id) => {
        setAddons((current) => current.map((addon) => (
            addon.id === id ? { ...addon, selected: !addon.selected } : addon
        )));
    };

    const handleSaveDraft = async () => {
        if (!bookingDetails) return;

        setIsSavingDraft(true);
        try {
            const selectedIds = addons.filter((addon) => addon.selected).map((addon) => addon.id);
            const res = await fetch(`${apiBaseUrl}/api/payments/draft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    booking_id: Number(bookingId),
                    selected_addons: selectedIds,
                    amount: calculateTotal.totalWithDeposit
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to save draft');
            }

            await loadPaymentState();
            alert('Draft saved successfully.');
        } catch (error) {
            alert(error.message || 'Error saving draft.');
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handleConfirmAndPay = async () => {
        if (!bookingDetails) return;

        setIsProcessing(true);
        try {
            const selectedIds = addons.filter((addon) => addon.selected).map((addon) => addon.id);
            const hashResponse = await fetch(`${apiBaseUrl}/api/payments/hash`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: `BOOKING_${bookingId}`,
                    amount: calculateTotal.totalWithDeposit,
                    currency: 'LKR'
                })
            });

            if (!hashResponse.ok) {
                throw new Error('Could not initialize payment hashing logic');
            }

            const hashData = await hashResponse.json();
            const payhere = window.payhere;

            payhere.onCompleted = async function onCompleted(orderId) {
                try {
                    await fetch(`${apiBaseUrl}/api/payments/confirm`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            booking_id: Number(bookingId),
                            amount: calculateTotal.totalWithDeposit,
                            transaction_id: orderId,
                            payment_method: 'card',
                            selected_addons: selectedIds
                        })
                    });
                } catch (error) {
                    console.error('Error confirming payment on backend:', error);
                }

                alert('Payment finalized successfully.');
                navigate('/user-dashboard', { state: { activeTab: 'Payments' } });
            };

            payhere.onDismissed = function onDismissed() {
                setIsProcessing(false);
            };

            payhere.onError = function onError(error) {
                setIsProcessing(false);
                alert(`Payment Error: ${error}`);
            };

            payhere.startPayment({
                sandbox: true,
                merchant_id: hashData.merchant_id,
                return_url: payHereReturnUrl,
                cancel_url: payHereCancelUrl,
                notify_url: payHereNotifyUrl,
                order_id: `BOOKING_${bookingId}`,
                items: `Trip Payment - Booking ${bookingId}`,
                amount: hashData.formattedAmount,
                currency: 'LKR',
                hash: hashData.hash,
                first_name: storedUser.name || 'Tourist',
                last_name: 'Customer',
                email: storedUser.email || 'guest@example.com',
                phone: storedUser.phone || '0000',
                address: 'Payment Center Portal',
                city: 'Colombo',
                country: 'Sri Lanka'
            });
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error trying to build payment window.');
            setIsProcessing(false);
        }
    };

    const handleDeleteDraft = async (id) => {
        if (!window.confirm('Delete this draft?')) return;

        try {
            const res = await fetch(`${apiBaseUrl}/api/payments/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete draft');
            }

            await loadPaymentState();
        } catch (error) {
            alert(error.message || 'Error deleting draft.');
        }
    };

    const handleDownloadPdf = async (paymentId) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/payments/${paymentId}/receipt-pdf`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to generate PDF');
            }

            const data = await res.json();
            const byteCharacters = window.atob(data.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i += 1) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([new Uint8Array(byteNumbers)], { type: data.mimeType || 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = data.fileName || `transaction-${paymentId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.message || 'Could not generate transaction PDF.');
        }
    };

    const handleRefundPayment = async (payment) => {
        if (isRefundBlockedByWindow(payment)) {
            alert(REFUND_WINDOW_MESSAGE);
            return;
        }

        const reason = window.prompt('Enter refund reason', 'Customer requested refund');
        if (reason === null) return;

        if (!window.confirm('Refund this transaction?')) return;

        let paymentIdOverride = '';
        if (!payment.transaction_id || !/^\d+$/.test(String(payment.transaction_id))) {
            paymentIdOverride = window.prompt(
                'Enter the numeric PayHere payment ID for this transaction. You can find it in your PayHere sandbox dashboard transaction details.',
                ''
            ) || '';

            if (!paymentIdOverride.trim()) {
                alert('Refund cancelled. Please enter a valid numeric PayHere payment ID.');
                return;
            }
        }

        try {
            const res = await fetch(`${apiBaseUrl}/api/payments/${payment.id}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason,
                    payment_id_override: paymentIdOverride.trim() || undefined
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error ? `${data.message}: ${data.error}` : (data.message || 'Refund failed'));
            }

            await loadPaymentState();
            alert('Refund request processed successfully.');
        } catch (error) {
            alert(error.message || 'Refund failed.');
        }
    };

    if (loading) {
        return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Payment Center...</div>;
    }

    return (
        <>
            <style>{styles}</style>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Fraunces:wght@500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            <div className="payment-layout">
                <header className="pc-header">
                    <div
                        onClick={() => navigate('/user-dashboard', { state: { activeTab: 'Payments' } })}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '14px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#059669',
                            cursor: 'pointer',
                            marginBottom: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #E5E7EB'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
                    </div>
                    <h1 className="pc-title">Payment Center</h1>
                    <div className="pc-subtitle">Review your booking, save a draft when needed, and keep a clean payment history.</div>
                </header>

                <nav className="pc-tabs">
                    {['Payment Portal', 'Saved Drafts', 'Transactions'].map((tab) => (
                        <div
                            key={tab}
                            className={`pc-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </nav>

                {activeTab === 'Payment Portal' && (
                    <main className="pc-main">
                        <div className="pc-card">
                            <div className="card-header">
                                <div>
                                    <div className="card-title">Payment Draft</div>
                                    <div className="pc-subtitle">Booking ID: #{bookingId}</div>
                                </div>
                                <button className="btn-outline" onClick={handleSaveDraft} disabled={isSavingDraft || !bookingDetails}>
                                    {isSavingDraft ? 'Saving...' : 'Save Draft'}
                                </button>
                            </div>

                            {bookingDetails ? (
                                <>
                                    <div className="section-label">Vehicle Details</div>
                                    <div className="info-block" style={{ padding: '0', overflow: 'hidden', background: 'white', border: '1px solid #E5E7EB' }}>
                                        <div style={{ width: '150px', height: '100px', background: '#F3F4F6' }}>
                                            {bookingDetails.Vehicle?.image_url ? (
                                                <img src={`${assetBaseUrl}${bookingDetails.Vehicle.image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Vehicle" />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>No Image</div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, padding: '16px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>{bookingDetails.Vehicle?.type || 'Vehicle'}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '6px' }}>Capacity: {bookingDetails.Vehicle?.capacity || 'N/A'} Seats</div>
                                            <div style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '6px' }}>Driver: {bookingDetails.Driver?.name || 'Assigned Driver'}</div>
                                        </div>
                                    </div>

                                    <div className="section-label">Trip Dates</div>
                                    <div className="info-block" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                                        <div style={{ fontWeight: 600 }}>
                                            {new Date(bookingDetails.Trip?.start_date).toLocaleDateString()} - {new Date(bookingDetails.Trip?.end_date).toLocaleDateString()}
                                            <span style={{ marginLeft: '10px', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '50px', fontSize: '0.85rem' }}>
                                                {Math.ceil((new Date(bookingDetails.Trip?.end_date) - new Date(bookingDetails.Trip?.start_date)) / (1000 * 60 * 60 * 24)) || 1} Days
                                            </span>
                                        </div>
                                        <span className={`status-pill ${paymentRecord ? 'draft' : 'completed'}`}>{paymentRecord ? 'Saved Draft' : 'Not Saved Yet'}</span>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '20px', color: '#6B7280', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No active booking found.</div>
                                    <div>We could not load booking details for ID #{bookingId}. Please go back to the dashboard and try again.</div>
                                </div>
                            )}

                            <div className="section-label" style={{ marginTop: '30px' }}>Additional Options</div>
                            <div>
                                {addons.map((addon) => (
                                    <div
                                        key={addon.id}
                                        className={`addon-row ${addon.selected ? 'selected' : ''}`}
                                        onClick={() => handleAddonToggle(addon.id)}
                                    >
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <input type="checkbox" checked={addon.selected} readOnly style={{ width: '18px', height: '18px', accentColor: '#059669' }} />
                                            <span style={{ fontWeight: 600, color: addon.selected ? '#047857' : '#374151' }}>{addon.name}</span>
                                        </div>
                                        <div style={{ fontWeight: 600 }}>+ LKR {addon.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="section-label" style={{ marginTop: '30px' }}>Pick-up Location</div>
                            <div className="info-block" style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', color: '#92400E' }}>
                                <div><strong>Colombo Main Branch</strong> - 123 Travel Road, Colombo 03</div>
                                <span style={{ fontSize: '0.9rem' }}>Reference location for trip pickup</span>
                            </div>
                        </div>

                        <div className="pc-card" style={{ height: 'fit-content' }}>
                            <div className="card-header">
                                <div className="card-title">Payment Summary</div>
                            </div>

                            <div className="cost-row">
                                <span>Vehicle Rental Fee</span>
                                <span>LKR {calculateTotal.baseCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="cost-row">
                                <span>Security Deposit (Refundable)</span>
                                <span>LKR 10,000.00</span>
                            </div>
                            <div className="cost-row">
                                <span style={{ color: '#059669' }}>Selected Add-ons</span>
                                <span style={{ color: '#059669' }}>+ LKR {calculateTotal.addonTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="cost-row">
                                <span>Service Tax (5%)</span>
                                <span>LKR {calculateTotal.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="total-row">
                                <span>Total Amount</span>
                                <span className="total-val">LKR {calculateTotal.totalWithDeposit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <button className="btn-primary" onClick={handleConfirmAndPay} disabled={isProcessing || !bookingDetails}>
                                {isProcessing ? 'Processing...' : 'Confirm & Pay Now'}
                            </button>

                            <div className="payment-policy-card">
                                <div className="payment-policy-heading">Refund Policy</div>
                                <div className="payment-policy-text">
                                    {getRefundPolicySummary(paymentRecord || bookingDetails ? { Booking: bookingDetails } : null)}
                                </div>
                                <div className="payment-policy-links">
                                    <button className="footer-link-btn" onClick={() => { setPolicyView('refund'); setPolicyModalOpen(true); }}>Read Refund Policy</button>
                                </div>
                            </div>

                            <div className="footer-links">
                                <p>
                                    By paying, you agree to our{' '}
                                    <button className="footer-link-btn" onClick={() => { setPolicyView('terms'); setPolicyModalOpen(true); }}>Terms</button>
                                    {' '}and{' '}
                                    <button className="footer-link-btn" onClick={() => { setPolicyView('privacy'); setPolicyModalOpen(true); }}>Privacy Policy</button>.
                                </p>
                                <p>Secure 256-bit SSL encrypted payment through PayHere sandbox.</p>
                            </div>
                        </div>
                    </main>
                )}

                {activeTab === 'Saved Drafts' && (
                    <main className="pc-main" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="pc-card">
                            <h2 style={{ marginBottom: '24px' }}>Your Saved Drafts</h2>
                            <div className="draft-grid">
                                {savedDrafts.map((draft) => (
                                    <article key={draft.id} className="draft-card">
                                        <div className="draft-media">
                                            {draft.Booking?.Vehicle?.image_url ? (
                                                <img src={`${assetBaseUrl}${draft.Booking.Vehicle.image_url}`} alt={draft.Booking?.Vehicle?.type || 'Vehicle'} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#24543a', fontWeight: 800, fontSize: '1.05rem' }}>
                                                    No vehicle image available
                                                </div>
                                            )}
                                            <div className="draft-chip-row">
                                                <span className="draft-status-chip">{draft.status}</span>
                                                <span className="draft-booking-chip">Booking #{draft.booking_id}</span>
                                            </div>
                                            <div className="draft-image-caption">
                                                <h4>{draft.Booking?.Vehicle?.type || 'Trip Reservation'}</h4>
                                                <p>{draft.Booking?.Driver?.name ? `Driver: ${draft.Booking.Driver.name}` : 'Ready to continue your reservation'}</p>
                                            </div>
                                        </div>
                                        <div className="draft-content">
                                            <div className="draft-meta-grid">
                                                <div className="draft-meta-item">
                                                    <div className="draft-meta-label">Last Updated</div>
                                                    <div className="draft-meta-value">{new Date(draft.updatedAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="draft-meta-item">
                                                    <div className="draft-meta-label">Payment Method</div>
                                                    <div className="draft-meta-value">{(draft.payment_method || draft.method || 'card').toUpperCase()}</div>
                                                </div>
                                                <div className="draft-meta-item">
                                                    <div className="draft-meta-label">Add-ons</div>
                                                    <div className="draft-meta-value">
                                                        {Array.isArray(draft.selected_addons) && draft.selected_addons.length > 0
                                                            ? draft.selected_addons.join(', ')
                                                            : 'No add-ons selected'}
                                                    </div>
                                                </div>
                                                <div className="draft-meta-item">
                                                    <div className="draft-meta-label">Trip Status</div>
                                                    <div className="draft-meta-value">{draft.Booking?.Trip?.status || 'Pending'}</div>
                                                </div>
                                            </div>

                                            <div className="draft-price-panel">
                                                <div>
                                                    <div className="draft-price-label">Draft Total</div>
                                                    <div className="draft-price-value">LKR {Number(draft.amount || 0).toLocaleString()}</div>
                                                </div>
                                                <div className="draft-price-note">Secure payment snapshot</div>
                                            </div>

                                            <div className="draft-footer">
                                                <div className="draft-footer-note">Ready to resume checkout</div>
                                                <div className="draft-action-row">
                                                    <button className="btn-primary" onClick={() => navigate(`/payment/${draft.booking_id}`)}>Resume Payment</button>
                                                    <button className="draft-delete-btn" onClick={() => handleDeleteDraft(draft.id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                                {savedDrafts.length === 0 && (
                                    <div className="draft-empty-state">
                                        <div style={{ fontSize: '2.3rem' }}>Receipt</div>
                                        <h3>No saved drafts yet</h3>
                                        <p>Your draft payments will appear here with quick resume and delete actions.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                )}

                {activeTab === 'Transactions' && (
                    <main className="pc-main" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="pc-card">
                            <h2 style={{ marginBottom: '24px' }}>Transaction History</h2>
                            <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                        <tr>
                                            <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                                            <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Booking</th>
                                            <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Transaction</th>
                                            <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Amount</th>
                                            <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                                            <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={{ padding: '16px', fontSize: '0.9rem' }}>{new Date(transaction.updatedAt).toLocaleDateString()}</td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem' }}>#{transaction.booking_id}</td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 600 }}>{transaction.transaction_id || `PAY-${transaction.id}`}</td>
                                                <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 600 }}>LKR {Number(transaction.amount || 0).toLocaleString()}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span className={`status-pill ${transaction.status}`}>{transaction.status.toUpperCase()}</span>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div className="action-row">
                                                        <button className="btn-outline" onClick={() => handleDownloadPdf(transaction.id)}>Transaction PDF</button>
                                                        {transaction.status === 'completed' && (
                                                            <button className="btn-outline" onClick={() => handleRefundPayment(transaction)}>Refund</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {transactions.length === 0 && <p style={{ padding: '20px', color: '#6B7280' }}>No transactions found.</p>}
                            </div>
                        </div>
                    </main>
                )}
            </div>

            {policyModalOpen && (
                <div className="modal-backdrop" onClick={() => setPolicyModalOpen(false)}>
                    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                            <div className="policy-shell">
                                <div className="policy-kicker">Payment Center Policies</div>
                                <h2 className="policy-title">{POLICY_CONTENT[policyView].title}</h2>
                                <p className="policy-intro">{POLICY_CONTENT[policyView].intro}</p>
                            </div>
                            <button className="btn-outline" onClick={() => setPolicyModalOpen(false)}>Close</button>
                        </div>
                        <div className="policy-switcher">
                            <button className={`policy-btn ${policyView === 'terms' ? 'active' : ''}`} onClick={() => setPolicyView('terms')}>Terms</button>
                            <button className={`policy-btn ${policyView === 'privacy' ? 'active' : ''}`} onClick={() => setPolicyView('privacy')}>Privacy Policy</button>
                            <button className={`policy-btn ${policyView === 'refund' ? 'active' : ''}`} onClick={() => setPolicyView('refund')}>Refund Policy</button>
                        </div>
                        {policyView === 'refund' && (
                            <div className="policy-refund-banner">
                                <div className="policy-refund-banner-title">Important Timing Rule</div>
                                <div className="policy-refund-banner-text">{REFUND_WINDOW_MESSAGE}</div>
                            </div>
                        )}
                        <div className="policy-section-list">
                            {POLICY_CONTENT[policyView].sections.map((section) => (
                                <section key={section.heading} className="policy-section-card">
                                    <h3 className="policy-section-heading">{section.heading}</h3>
                                    <div className="policy-points">
                                        {section.points.map((point) => (
                                            <div key={point} className="policy-point">{point}</div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

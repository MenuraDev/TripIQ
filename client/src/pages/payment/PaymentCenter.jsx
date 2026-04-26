import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .payment-layout { display: flex; flex-direction: column; min-height: 100vh; width: 100%; background: #F3F4F6; font-family: 'DM Sans', sans-serif; }
  .pc-header { padding: 40px 60px 20px; text-align: left; }
  .pc-title { font-family: 'DM Sans', sans-serif; font-size: 2.5rem; font-weight: 700; color: #111827; margin: 0; }
  .pc-subtitle { color: #6B7280; font-size: 1rem; margin-top: 5px; }
  
  .pc-tabs { display: flex; gap: 40px; border-bottom: 1px solid #E5E7EB; padding: 0 60px; margin-bottom: 40px; }
  .pc-tab { padding: 16px 0; color: #6B7280; font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.3s; }
  .pc-tab.active { color: #059669; border-bottom-color: #059669; }

  .pc-main { display: grid; grid-template-columns: 65% 35%; gap: 30px; padding: 0 60px 60px; }
  @media (max-width: 900px) { .pc-main { grid-template-columns: 1fr; } }
  
  .pc-card { background: white; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 30px; border: 1px solid #E5E7EB; }
  .card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; margin-bottom: 20px; }
  .card-title { font-family: 'DM Sans', sans-serif; font-size: 1.5rem; font-weight: 700; color: #111827; }

  .btn-outline { background: white; border: 1px solid #E5E7EB; color: #374151; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .btn-outline:hover { background: #F9FAFB; }
  .btn-primary { background: #059669; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer; width: 100%; font-size: 1.1rem; transition: 0.3s; }
  .btn-primary:hover { background: #047857; }
  .btn-primary:disabled { background: #D1D5DB; cursor: not-allowed; }

  .section-label { font-size: 0.85rem; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 12px; }
  
  .info-block { background: #F9FAFB; padding: 16px; border-radius: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;}
  
  .addon-row { display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 12px; cursor: pointer; transition: 0.2s; }
  .addon-row:hover { border-color: #10B981; }
  .addon-row.selected { border-color: #059669; background: #ECFDF5; }
  
  .cost-row { display: flex; justify-content: space-between; margin-bottom: 16px; color: #374151; font-weight: 500; }
  .total-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #E5E7EB; padding-top: 20px; margin-top: 20px; margin-bottom: 30px; font-weight: 700; color: #111827; }
  .total-val { font-size: 2rem; color: #059669; font-family: 'DM Sans', sans-serif; }
  
  .footer-links { text-align: center; margin-top: 20px; font-size: 0.8rem; color: #9CA3AF; }
`;

export default function PaymentCenter() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Payment Portal');

    // Real Data State
    const [paymentRecord, setPaymentRecord] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [addons, setAddons] = useState([
        { id: 'driver', name: 'Professional Driver', price: 5000, selected: false },
        { id: 'insurance', name: 'Extra Insurance', price: 2500, selected: false },
        { id: 'gps', name: 'GPS Device', price: 1000, selected: false }
    ]);
    const [savedDrafts, setSavedDrafts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!storedUser.token) { navigate('/login'); return; }

        const fetchData = async () => {
            try {
                // Fetch current booking/payment portal data
                // Fetch current booking data directly
                if (bookingId) {
                    const bookingRes = await fetch(`http://localhost:5007/api/bookings/${bookingId}`, {
                        headers: { Authorization: `Bearer ${storedUser.token}` }
                    });
                    if (bookingRes.ok) {
                        const bookingData = await bookingRes.json();
                        setBookingDetails(bookingData);
                    } else {
                        const errorData = await bookingRes.json();
                        console.error("Booking Fetch Failed:", errorData.message || bookingRes.statusText);
                    }

                    // Also fetch payment records to see if a draft exists for this booking
                    const paymentsRes = await fetch(`http://localhost:5007/api/payments/my`, {
                        headers: { Authorization: `Bearer ${storedUser.token}` }
                    });
                    const allPayments = await paymentsRes.json();
                    const currentPayment = allPayments.find(p => p.booking_id === parseInt(bookingId));
                    if (currentPayment) {
                        setPaymentRecord(currentPayment);
                        // Map saved addons if they exist
                        if (currentPayment.selected_addons) {
                            const savedIds = JSON.parse(currentPayment.selected_addons);
                            setAddons(prev => prev.map(a => ({ ...a, selected: savedIds.includes(a.id) })));
                        }
                    }
                }

                // Fetch Drafts and Transactions for other tabs
                const resAll = await fetch('http://localhost:5007/api/payments/my', {
                    headers: { Authorization: `Bearer ${storedUser.token}` }
                });
                const payments = await resAll.json();
                setSavedDrafts(payments.filter(p => p.status === 'draft' || p.status === 'pending'));
                setTransactions(payments.filter(p => p.status === 'completed' || p.status === 'failed'));

                setLoading(false);
            } catch (error) {
                console.error("Error fetching payment data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [bookingId, storedUser.token, navigate]);

    const handleAddonToggle = (id) => {
        setAddons(addons.map(opt => opt.id === id ? { ...opt, selected: !opt.selected } : opt));
    };

    const calculateTotal = () => {
        if (!bookingDetails) return { subtotal: 0, tax: 0, addonTotal: 0, grandTotal: 0 };
        const addonTotal = addons.filter(a => a.selected).reduce((sum, a) => sum + Number(a.price), 0);
        const subtotal = Number(bookingDetails.Trip?.total_cost || 0) + addonTotal;
        const tax = subtotal * 0.05;
        return { subtotal, tax, addonTotal, grandTotal: subtotal + tax };
    };

    const { addonTotal, tax, grandTotal } = calculateTotal();

    const handleSaveDraft = async () => {
        if (!paymentRecord) return;
        try {
            const selectedIds = addons.filter(a => a.selected).map(a => a.id);
            const res = await fetch(`http://localhost:5007/api/payments/${paymentRecord.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${storedUser.token}` },
                body: JSON.stringify({
                    selected_addons: selectedIds,
                    amount: grandTotal + 10000 // including deposit
                })
            });
            if (res.ok) {
                alert("Draft saved successfully!");
                // Refresh saved drafts list
                const resAll = await fetch('http://localhost:5007/api/payments/my', {
                    headers: { Authorization: `Bearer ${storedUser.token}` }
                });
                const payments = await resAll.json();
                setSavedDrafts(payments.filter(p => p.status === 'draft' || p.status === 'pending'));
            }
        } catch (error) {
            alert("Error saving draft.");
        }
    };

    const handleConfirmAndPay = async () => {
        setIsProcessing(true);
        try {
            const hashResponse = await fetch('http://localhost:5007/api/payments/hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${storedUser.token}` },
                body: JSON.stringify({
                    order_id: `BOOKING_${bookingId}`,
                    amount: grandTotal + 10000,
                    currency: 'LKR'
                })
            });

            if (!hashResponse.ok) throw new Error("Could not initialize payment hashing logic");
            const hashData = await hashResponse.json();

            const payhere = window.payhere;
            payhere.onCompleted = async function onCompleted(orderId) {
                try {
                    // Notify backend of success directly from client (fallback for local dev)
                    await fetch('http://localhost:5007/api/payments/confirm', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${storedUser.token}`
                        },
                        body: JSON.stringify({
                            booking_id: bookingId,
                            amount: grandTotal + 10000,
                            transaction_id: orderId,
                            payment_method: 'card'
                        })
                    });
                } catch (err) {
                    console.error("Error confirming payment on backend:", err);
                }

                alert("Payment Finalized Successfully!");
                navigate('/user-dashboard');
            };
            payhere.onDismissed = function onDismissed() {
                setIsProcessing(false);
            };
            payhere.onError = function onError(error) {
                setIsProcessing(false);
                alert("Payment Error: " + error);
            };

            const paymentObj = {
                sandbox: true,
                merchant_id: hashData.merchant_id,
                return_url: 'http://localhost:3000/user-dashboard',
                cancel_url: 'http://localhost:3000/user-dashboard',
                notify_url: 'http://localhost:5007/api/payments/notify',
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
            };

            payhere.startPayment(paymentObj);
        } catch (error) {
            console.error(error);
            alert("Error trying to build payment window.");
            setIsProcessing(false);
        }
    };

    const handleDeleteDraft = async (id) => {
        if (!window.confirm("Delete this draft?")) return;
        try {
            const res = await fetch(`http://localhost:5007/api/payments/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            if (res.ok) {
                setSavedDrafts(prev => prev.filter(d => d.id !== id));
            }
        } catch (error) {
            alert("Error deleting draft.");
        }
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Payment Center...</div>;

    return (
        <>
            <style>{styles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            <div className="payment-layout">
                {/* PART 4.1 Header Section */}
                <header className="pc-header">
                    <div
                        onClick={() => navigate('/user-dashboard', { state: { activeTab: 'My Trips' } })}
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
                            transition: 'all 0.2s',
                            border: '1px solid #E5E7EB'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateX(-4px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
                    </div>
                    <h1 className="pc-title">Payment Center</h1>
                    <div className="pc-subtitle">Review your booking draft and finalize transactions securely.</div>
                </header>

                {/* PART 4.2 Navigation Tabs Row */}
                <nav className="pc-tabs">
                    {['Payment Portal', 'Saved Drafts', 'Transactions'].map(tab => (
                        <div
                            key={tab}
                            className={`pc-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </nav>

                {/* Main View Logic Based on Tab */}
                {
                    activeTab === 'Payment Portal' && (
                        <main className="pc-main">
                            {/* PART 6: Left Column - Payment Draft Card */}
                            <div className="pc-card">
                                <div className="card-header">
                                    <div>
                                        <div className="card-title">Payment Draft</div>
                                        <div className="pc-subtitle">Booking ID: #{bookingId}</div>
                                    </div>
                                    <button className="btn-outline" onClick={handleSaveDraft}>Save Draft</button>
                                </div>

                                {bookingDetails ? (
                                    <>
                                        <div className="section-label">Vehicle Details</div>
                                        <div className="info-block" style={{ padding: '0', overflow: 'hidden', background: 'white', border: '1px solid #E5E7EB' }}>
                                            <div style={{ width: '150px', height: '100px', background: '#F3F4F6' }}>
                                                {bookingDetails.Vehicle?.image_url ? (
                                                    <img src={`http://localhost:5007${bookingDetails.Vehicle.image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Vehicle" />
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>No Image</div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1, padding: '16px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>{bookingDetails.Vehicle?.type || 'Vehicle'}</div>
                                                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Capacity: {bookingDetails.Vehicle?.capacity || 'N/A'} Seats</div>
                                            </div>
                                            <div style={{ paddingRight: '20px' }}>
                                                <button className="btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => navigate(`/user-dashboard?editTripId=${bookingDetails.Trip.id}&step=4`)}>Change Vehicle</button>
                                            </div>
                                        </div>

                                        <div className="section-label">Duration & Trip Dates</div>
                                        <div className="info-block" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                                            <div style={{ fontWeight: 600 }}>
                                                📅 {new Date(bookingDetails.Trip?.start_date).toLocaleDateString()} - {new Date(bookingDetails.Trip?.end_date).toLocaleDateString()}
                                                <span style={{ marginLeft: '10px', color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '50px', fontSize: '0.85rem' }}>
                                                    {Math.ceil((new Date(bookingDetails.Trip?.end_date) - new Date(bookingDetails.Trip?.start_date)) / (1000 * 60 * 60 * 24)) || 1} Days
                                                </span>
                                            </div>
                                            <button className="btn-outline" style={{ border: 'none', color: '#059669', padding: 0 }} onClick={() => navigate(`/user-dashboard?editTripId=${bookingDetails.Trip.id}&step=1`)}>Edit Dates</button>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ padding: '20px', color: '#6B7280', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>⚠️ No active booking found.</div>
                                        <div>We couldn't load booking details for ID #{bookingId}. Please go back to the dashboard and try again.</div>
                                        <button className="btn-outline" style={{ marginTop: '15px' }} onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
                                    </div>
                                )}

                                <div className="section-label" style={{ marginTop: '30px' }}>Additional Options</div>
                                <div>
                                    {addons.map(addon => (
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
                                <div className="info-block" style={{ background: '#FFFBEB', borderColor: '#FEF3C7', color: '#92400E' }}>
                                    <div>📍 <strong>Colombo Main Branch</strong> - 123 Travel Road, Colombo 03</div>
                                    <div style={{ textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>View Map</div>
                                </div>
                            </div>

                            {/* PART 7: Right Column - Payment Summary Card */}
                            <div className="pc-card" style={{ height: 'fit-content' }}>
                                <div className="card-header">
                                    <div className="card-title">Payment Summary</div>
                                </div>

                                <div className="cost-row">
                                    <span>Vehicle Rental Fee</span>
                                    <span>LKR {bookingDetails?.Trip?.total_cost?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="cost-row">
                                    <span>Security Deposit (Refundable)</span>
                                    <span>LKR 10,000.00</span>
                                </div>
                                <div className="cost-row">
                                    <span style={{ color: '#059669' }}>Selected Add-ons</span>
                                    <span style={{ color: '#059669' }}>+ LKR {addonTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="cost-row">
                                    <span>Service Tax (5%)</span>
                                    <span>LKR {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="total-row">
                                    <span>Total Amount</span>
                                    <span className="total-val">LKR {(grandTotal + 10000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>

                                <button
                                    className="btn-primary"
                                    onClick={handleConfirmAndPay}
                                    disabled={isProcessing || !bookingDetails}
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm & Pay Now'}
                                </button>

                                <div className="footer-links">
                                    <p>By paying, you agree to our Terms and Privacy Policy.</p>
                                    <p>🔒 Secure 256-bit SSL encrypted payment</p>
                                </div>
                            </div>
                        </main >
                    )
                }

                {
                    activeTab === 'Saved Drafts' && (
                        <main className="pc-main" style={{ gridTemplateColumns: '1fr' }}>
                            <div className="pc-card">
                                <h2 style={{ fontFamily: "'Playfair Display'", marginBottom: '24px' }}>Your Saved Drafts</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {savedDrafts.map(draft => (
                                        <div key={draft.id} style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1px solid #E5E7EB', position: 'relative', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                            {draft.Booking?.Vehicle?.image_url ? (
                                                <div style={{ height: '160px', margin: '-32px -32px 24px -32px', borderRadius: '32px 32px 0 0', overflow: 'hidden', background: '#F3F4F6', position: 'relative' }}>
                                                    <img src={`http://localhost:5007${draft.Booking.Vehicle.image_url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Vehicle" />
                                                    <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '6px 16px', background: 'rgba(254, 243, 199, 0.9)', color: '#92400E', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', backdropFilter: 'blur(4px)' }}>
                                                        {draft.status}
                                                    </div>
                                                    <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                                                        #{draft.booking_id}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                    <div style={{ padding: '6px 16px', background: 'rgba(254, 243, 199, 0.5)', color: '#92400E', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        {draft.status}
                                                    </div>
                                                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>#{draft.booking_id}</span>
                                                </div>
                                            )}

                                            <h4 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '12px', color: '#111827' }}>{draft.Booking?.Vehicle?.type || 'Trip Reservation'}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#6B7280' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>event_note</span>
                                                <span style={{ fontSize: '0.95rem' }}>Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginBottom: '32px', marginTop: 'auto' }}>
                                                LKR {draft.amount?.toLocaleString() || '0'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    className="btn-primary"
                                                    style={{ flex: 1, padding: '14px', fontSize: '1rem', background: '#059669', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                                                    onClick={() => navigate(`/payment/${draft.booking_id}`)}
                                                >
                                                    Resume Payment
                                                </button>
                                                <button
                                                    className="btn-outline"
                                                    style={{ border: '1px solid #FCA5A5', background: 'white', color: '#EF4444', padding: '14px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    onClick={() => handleDeleteDraft(draft.id)}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete_forever</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {savedDrafts.length === 0 && <p style={{ color: '#6B7280' }}>No saved drafts found.</p>}
                                </div>
                            </div>
                        </main>
                    )
                }

                {
                    activeTab === 'Transactions' && (
                        <main className="pc-main" style={{ gridTemplateColumns: '1fr' }}>
                            <div className="pc-card">
                                <h2 style={{ fontFamily: "'Playfair Display'", marginBottom: '24px' }}>Transaction History</h2>
                                <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                            <tr>
                                                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                                                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Booking</th>
                                                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Amount</th>
                                                <th style={{ padding: '16px', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(t => (
                                                <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>{new Date(t.updatedAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem' }}>#{t.booking_id}</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 600 }}>LKR {t.amount?.toLocaleString()}</td>
                                                    <td style={{ padding: '16px' }}>
                                                        <span style={{
                                                            fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px',
                                                            background: t.status === 'completed' ? '#ECFDF5' : '#FEF2F2',
                                                            color: t.status === 'completed' ? '#065F46' : '#991B1B',
                                                            fontWeight: 700
                                                        }}>{t.status.toUpperCase()}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {transactions.length === 0 && <p style={{ padding: '20px', color: '#6B7280' }}>No transactions found.</p>}
                                </div>
                            </div>
                        </main>
                    )
                }

            </div >
        </>
    );
}

const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for PayHere to call
router.post('/notify', payhereNotify);

// Tourist routes
router.post('/confirm', protect, confirmPaymentSuccess);
router.post('/hash', protect, generatePaymentHash);
router.post('/draft', protect, saveDraftPayment);
router.get('/my', protect, getMyPayments);
router.get('/:id/receipt-pdf', protect, downloadPaymentReceiptPdf);
router.post('/:id/refund', protect, refundPayment);
router.route('/:id')
    .get(protect, getPaymentDetails)
    .put(protect, updatePayment)
    .delete(protect, deletePayment);

// Admin routes
router.get('/', protect, admin, getAllPayments);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/subscribe', paymentController.buySubscription); // /api/payment/subscribe
router.post('/add-money', paymentController.addMoneyToWallet); // /api/payment/add-money

module.exports = router;
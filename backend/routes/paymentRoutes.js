import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', optionalAuth, createRazorpayOrder);
router.post('/verify', optionalAuth, verifyRazorpayPayment);

export default router;

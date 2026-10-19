import express from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController.js';
import authMiddleware, { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', optionalAuth, getOrder);

// TODO(admin): PATCH /:id/status (order status updates) is intentionally NOT exposed
// until admin sign-in exists. Re-add it behind an adminOnly middleware.

export default router;

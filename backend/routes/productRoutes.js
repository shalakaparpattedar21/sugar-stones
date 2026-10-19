import express from 'express';
import { getProducts, getProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// TODO(admin): POST / , PUT /:id and DELETE /:id (createProduct, updateProduct, deleteProduct)
// are intentionally NOT exposed until admin sign-in exists. The controllers are kept in
// productController.js; re-add the routes behind authMiddleware + an adminOnly middleware.

export default router;

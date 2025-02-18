import { Router } from 'express';
import verifyToken from '../middlewares/auth'; // or use your 'protect' middleware
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controllers/productController';

const router: Router = Router();

// Create a new post
router
  .route('/')
  .post(verifyToken, createProduct)
  .get(verifyToken, getAllProducts);

// Update or Delete a post
router
  .route('/:id')
  .get(verifyToken, getProduct)
  .put(verifyToken, updateProduct)
  .delete(verifyToken, deleteProduct);

export const productRoutes = router;

import { Router } from 'express';
import verifyToken from '../middlewares/auth';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controllers/productController';

const router: Router = Router();

router
  .route('/')
  .post(verifyToken, createProduct)
  .get(verifyToken, getAllProducts);

router
  .route('/:id')
  .get(verifyToken, getProduct)
  .put(verifyToken, updateProduct)
  .delete(verifyToken, deleteProduct);

export const productRoutes = router;

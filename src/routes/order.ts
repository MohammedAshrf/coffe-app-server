import { Router } from 'express';
import verifyToken from '../middlewares/auth';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  //   getOrdersByUserId,
  // Add this new controller
} from '../controllers/orderController';

const router: Router = Router();

// Create a new order and get all orders
router.route('/').post(verifyToken, createOrder).get(verifyToken, getAllOrders);

// Get orders by userId
// router.route('/:userId').get(verifyToken, getOrdersByUserId);

// Update or Delete an order, Get order by ID
router
  .route('/:id')
  .get(verifyToken, getOrder)
  .put(verifyToken, updateOrder)
  .delete(verifyToken, deleteOrder);

export const orderRoutes = router;

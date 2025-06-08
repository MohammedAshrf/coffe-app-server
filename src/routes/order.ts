import { Router } from 'express';
import verifyToken from '../middlewares/auth';
import // createOrder,
// deleteOrder,
// getAllOrders,
// getOrder,
// updateOrder,
//   getOrdersByUserId,
// Add this new controller
'../controllers/orderController';
import {
  createEntity,
  deleteEntity,
  // createEntity,
  getAllEntities,
  getEntity,
  updateEntity,
} from '../controllers/factoryController';
import { Order } from '../models/Order.model';
import {
  createOrderOptions,
  deleteOrderOptions,
  getAllOrderOptions,
  getOrderOptions,
  updateOrderOptions,
} from '../middlewares/orderOptions';

const router: Router = Router();

// router.route('/').post(verifyToken, createOrder).get(verifyToken, getAllOrders);
router
  .route('/')
  .post(verifyToken, createOrderOptions, createEntity(Order))
  .get(verifyToken, getAllOrderOptions, getAllEntities(Order));

// router
//   .route('/:id')
//   .get(verifyToken, getOrder)
//   .put(verifyToken, updateOrder)
//   .delete(verifyToken, deleteOrder);

router
  .route('/:id')
  .get(verifyToken, getOrderOptions, getEntity(Order))
  .put(verifyToken, updateOrderOptions, updateEntity(Order))
  .delete(verifyToken, deleteOrderOptions, deleteEntity(Order));

export const orderRoutes = router;

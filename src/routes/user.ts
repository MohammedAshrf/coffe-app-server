import { Router } from 'express';
import verifyToken from '../middlewares/auth';
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  getUserOrders,
} from '../controllers/userController';

const router: Router = Router();

router.route('/').get(verifyToken, getAllUsers);

router
  .route('/:id')
  .get(verifyToken, getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

router.route('/:id/orders').get(verifyToken, getUserOrders);

export const userRoutes = router;

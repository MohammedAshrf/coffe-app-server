import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';
import { IOrder, Order } from '../models/Order.model';
import { User } from '../models/User.model';
import {
  getAllEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from './factoryController';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

// export const getAllOrders = getAllEntities(Order);
// export const getOrder = getEntity(Order);
// export const createOrder = createEntity(Order);
// export const updateOrder = updateEntity(Order);
// export const deleteOrder = deleteEntity(Order);

// export const getAllOrders = catchError(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const orders = await Order.find().populate('orderItems.productId');
//     // .populate('userId');

//     if (orders.length === 0) {
//       res.status(200).json({ message: 'No Orders found', data: { orders } });
//       return;
//     }

//     res.status(200).json({
//       message: 'Orders fetched successfully',
//       data: { orders },
//     });

//     console.log('Orders:', orders);
//   },
// );

// export const getOrder = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;

//     const query = id.includes('user-')
//       ? { userId: id.replace('user-', '') }
//       : { _id: id };

//     const orders = await Order.find(query)
//       .populate('orderItems.productId')
//       .populate('userId');

//     if (!orders || orders.length === 0) {
//       return next(new AppError('No orders found', 404));
//     }

//     if (req.user?.role !== 'admin' && req.user?.id !== id) {
//       return next(
//         new AppError('You are not authorized to view this order', 403),
//       );
//     }

//     res.status(200).json({
//       message: 'Orders fetched successfully',
//       data: { orders },
//     });
//   },
// );

// export const createOrder = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { orderItems, totalPrice, status } = req.body;

//     if (!orderItems || !totalPrice) {
//       return next(
//         new AppError('Order items and total price are required', 400),
//       );
//     }

//     const userId = req.user?.id;

//     const newOrder: IOrder = await Order.create({
//       userId: userId,
//       orderItems,
//       totalPrice,
//       status: status,
//     });

//     await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

//     res.status(201).json({
//       message: 'Order created successfully',
//       data: { order: newOrder },
//     });
//   },
// );

// export const updateOrder = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status || !['pending', 'completed', 'canceled'].includes(status)) {
//       return next(
//         new AppError('Valid status is required to update an order', 400),
//       );
//     }

//     const order = await Order.findById(id);
//     const userId = order?.userId.toString();

//     console.log('userId', userId);
//     console.log('req.user?.id', req.user?.id);

//     const user = await User.findById(req.user?.id);
//     if (userId !== req.user?.id && user?.role !== 'admin') {
//       return next(new AppError('You are not authorized to update orders', 403));
//     }

//     const updatedorder = await Order.findByIdAndUpdate(id).populate(
//       'orderItems.productId',
//     );

//     if (!updatedorder) {
//       return next(new AppError('Order not found', 404));
//     }

//     if (status) updatedorder.status = status;
//     if (status == 'canceled') {
//       updatedorder.canceledAt = new Date();
//     }

//     await updatedorder.save();

//     res.status(200).json({
//       message: 'Order updated successfully',
//       data: { updatedorder },
//     });
//   },
// );

// export const deleteOrder = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;

//     const user = await User.findById(req.user?.id);
//     if (user?.role !== 'admin') {
//       return next(new AppError('You are not authorized to delete orders', 403));
//     }

//     const order = await Order.findByIdAndDelete(id);
//     if (!order) {
//       return next(new AppError('Order not found', 404));
//     }

//     res.status(200).json({ message: 'Order deleted successfully' });
//   },
// );

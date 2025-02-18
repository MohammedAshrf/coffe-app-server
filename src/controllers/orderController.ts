import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';
import { IOrder, Order } from '../models/Order.model';
import { User } from '../models/User.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const getAllOrders = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const orders = await Order.find();
    //   .populate('orderItems.productId')
    //   .populate('userId');

    if (orders.length === 0) {
      res.status(200).json({ message: 'No Orders found', data: { orders } });
      return;
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      data: { orders },
    });
  },
);

export const createOrder = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { orderItems, totalPrice, status } = req.body;

    if (!orderItems || !totalPrice) {
      return next(
        new AppError('Order items and total price are required', 400),
      );
    }

    const newOrder: IOrder = await Order.create({
      userId: req.user?.id,
      orderItems,
      totalPrice,
      status: status || 'pending',
    });

    res.status(201).json({
      message: 'Order created successfully',
      data: { order: newOrder },
    });
  },
);

export const getOrder = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    const query = id.includes('user-')
      ? { userId: id.replace('user-', '') }
      : { _id: id };

    const orders = await Order.find(query)
      .populate('orderItems.productId')
      .populate('userId');

    if (!orders || orders.length === 0) {
      return next(new AppError('No orders found', 404));
    }

    if (req.user?.role !== 'admin') {
      if (req.user?.id !== orders[0].userId.toString()) {
        return next(new AppError('Unauthorized to view this order', 403));
      }
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      data: { orders },
    });
  },
);

export const updateOrder = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'completed', 'canceled'].includes(status)) {
      return next(
        new AppError('Valid status is required to update an order', 400),
      );
    }

    const user = await User.findById(req.user?.id);
    if (user?.role !== 'admin') {
      return next(new AppError('You are not authorized to update orders', 403));
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate('orderItems.productId');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({
      message: 'Order updated successfully',
      data: { order },
    });
  },
);

export const deleteOrder = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    const user = await User.findById(req.user?.id);
    if (user?.role !== 'admin') {
      return next(new AppError('You are not authorized to delete orders', 403));
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  },
);

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model'; // adjust path if needed
import { IOrder, Order } from '../models/Order.model'; // adjust path if needed
import AppError from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: { id: string; name?: string };
}

export const getAllOrderOptions = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.customQueryOptions = {
    populate: [
      { path: 'orderItems.productId', select: 'name price' },
      { path: 'userId', select: 'name' },
    ],
    // Add other options if needed (select, sort, etc.)
  };

  next();
};

export const getOrderOptions = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  const isUser = id.includes('user-');
  const userId = id.replace('user-', '');

  const query = isUser ? { userId } : { _id: id };

  const user = (req as any).user;
  if (user?.role !== 'admin' && user?.id !== userId && !isUser) {
    return next(new AppError('You are not authorized to view this order', 403));
  }

  (req as any).queryOptions = query;
  next();
};

export const createOrderOptions = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // cast if you're not using AuthRequest
  const userId = (req as AuthRequest).user?.id;

  res.locals.customCreateOptions = {
    inject: {
      userId,
      status: req.body.status,
    },
    afterCreate: async (newOrder: IOrder) => {
      await User.findByIdAndUpdate(userId, {
        $push: { orders: newOrder._id },
      });
    },
  };

  next();
};

export const updateOrderOptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'completed', 'canceled'].includes(status)) {
    return next(
      new AppError('Valid status is required to update an order', 400),
    );
  }

  const order = await Order.findById(id);
  if (!order) return next(new AppError('Order not found', 404));

  const userId = order.userId.toString();
  const user = await User.findById((req as any).user?.id);

  if (userId !== (req as any).user?.id && user?.role !== 'admin') {
    return next(new AppError('You are not authorized to update orders', 403));
  }

  // Handle special status logic
  if (status === 'canceled') {
    req.body.canceledAt = new Date();
  }

  next();
};

export const deleteOrderOptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const { id } = req.params;

  // const order = await Order.findById(id);
  // if (!order) return next(new AppError('Order not found', 404));

  const user = await User.findById((req as any).user?.id);
  if (user?.role !== 'admin') {
    return next(new AppError('You are not authorized to delete orders', 403));
  }

  next();
};

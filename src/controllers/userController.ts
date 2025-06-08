import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';
import { IUser, User } from '../models/User.model';
import {
  deleteEntity,
  getAllEntities,
  getEntity,
  updateEntity,
} from './factoryController';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const getAllUsers = getAllEntities(
  User as Model<IUser & { _id: Types.ObjectId }>,
);
export const getUser = getEntity(
  User as Model<IUser & { _id: Types.ObjectId }>,
);
export const updateUser = updateEntity(
  User as Model<IUser & { _id: Types.ObjectId }>,
);
export const deleteUser = deleteEntity(
  User as Model<IUser & { _id: Types.ObjectId }>,
);

export const getUserOrders = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    const user = await User.findById(id).populate('orders');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    console.log('req.user?.id:', req.user?.id);
    console.log('id:', id);

    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      return next(
        new AppError('You are not authorized to view these orders', 403),
      );
    }

    res.status(200).json({
      message: 'User orders fetched successfully',
      data: { orders: user.orders },
    });
  },
);

// export const getAllUsers = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const users = await User.find()
//       .select('-password -refreshToken -passwordChangeAt')
//       .populate('cart.productId')
//       .populate('orders');

//     if (users.length === 0) {
//       res.status(200).json({ message: 'No Users found', data: { users } });
//       return;
//     }

//     if (req.user?.role !== 'admin') {
//       return next(
//         new AppError('You are not authorized to delete this user', 403),
//       );
//     }

//     res.status(200).json({
//       message: 'Users fetched successfully',
//       data: { users },
//     });
//   },
// );

// export const updateUser = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;
//     const { name, email, password } = req.body;

//     if (!name && !email && !password) {
//       return next(
//         new AppError('At least one field is required to update', 400),
//       );
//     }

//     const user = await User.findById(id);
//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     if (req.user?.role !== 'admin' && req.user?.id !== id) {
//       return next(
//         new AppError('You are not authorized to update this user', 403),
//       );
//     }

//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (password) user.password = password;

//     await user.save();

//     const updatedUser = await User.findById(id)
//       .select('-password -refreshToken -passwordChangeAt')
//       .populate('cart.productId');

//     res.status(200).json({
//       message: 'User updated successfully',
//       data: { user: updatedUser },
//     });
//   },
// );

// export const getUser = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;

//     const user = await User.findById(id)
//       .select('-password -refreshToken -passwordChangeAt')
//       .populate('cart.productId');

//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     if (req.user?.role !== 'admin' && req.user?.id !== id) {
//       return next(
//         new AppError('You are not authorized to view this user', 403),
//       );
//     }

//     res
//       .status(200)
//       .json({ message: 'User fetched successfully', data: { user } });
//   },
// );

// export const deleteUser = catchError(
//   async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction,
//   ): Promise<void> => {
//     const { id } = req.params;

//     const user = await User.findById(id);
//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     console.log(req.user);

//     if (req.user?.role !== 'admin' && req.user?.id !== id) {
//       return next(
//         new AppError('You are not authorized to delete this user', 403),
//       );
//     }

//     await User.findByIdAndDelete(id);

//     res.status(200).json({ message: 'User deleted successfully' });
//   },
// );

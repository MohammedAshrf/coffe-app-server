import mongoose, { Schema, Types } from 'mongoose';
import { IUser } from './User.model';
import { IProduct } from './Product.model';

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
  status: 'pending' | 'completed' | 'canceled';
  orderItems: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}

// Populated version
export interface IOrderPopulated extends Omit<IOrder, 'userId' | 'orderItems'> {
  userId: IUser; // Now contains the full User object
  orderItems: {
    productId: IProduct; // Now contains the full Product object
    quantity: number;
    price: number;
  }[];
}

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  totalPrice: Number,
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  },
  orderItems: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.model<IOrder>('Order', OrderSchema);

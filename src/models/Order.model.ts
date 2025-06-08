import mongoose, { Schema, Types } from 'mongoose';
import { IUser } from './User.model';
import { IProduct } from './Product.model';

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
  status: 'pending' | 'completed' | 'canceled';
  canceledAt: Date;
  notes: string;
  orderItems: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}

// Populated version
export interface IOrderPopulated extends Omit<IOrder, 'userId' | 'orderItems'> {
  userId: IUser;
  orderItems: {
    productId: IProduct;
    quantity: number;
    price: number;
  }[];
}

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  },
  canceledAt: { type: Date, default: null },
  notes: { type: String },
  orderItems: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      // price: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

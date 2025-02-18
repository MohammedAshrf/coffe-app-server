import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { IUser } from './User.model';

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  reviews: {
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}

// Populated version
export interface IProductPopulated extends Omit<IProduct, 'reviews'> {
  reviews: {
    userId: IUser; // Now contains the full User object
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  reviews: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

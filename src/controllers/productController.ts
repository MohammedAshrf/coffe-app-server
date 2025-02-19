import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { catchError } from '../utils/catchError';
import { IProduct, Product } from '../models/Product.model';
import { User } from '../models/User.model';

// Extend Express Request to include the user (provided by JWT middleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const getAllProducts = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const products = await Product.find();

    if (products.length === 0) {
      res
        .status(200)
        .json({ message: 'No Products found', data: { products } });
      return;
    }

    res.status(200).json({
      message: 'Products fetched successfully',
      data: { products: products },
    });
  },
);

export const createProduct = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { name, description, price, imageUrl, category } = req.body;

    if (!name || !description || !price || !imageUrl || !category) {
      return next(new AppError('All fields are required', 400));
    }

    console.log('User data:', req.user);

    const user = await User.findById(req.user?.id);

    if (user?.role !== 'admin') {
      return next(new AppError('Unauthorized', 401));
    }

    const newProduct: IProduct = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
    });

    res.status(201).json({
      message: 'Product created successfully',
      data: { product: newProduct },
    });
  },
);

export const getProduct = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res
      .status(200)
      .json({ message: 'Product fetched successfully', data: { product } });
  },
);

export const updateProduct = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;
    const { name, description, price, imageUrl, category } = req.body;

    if (!name && !description && !price && !imageUrl && !category) {
      return next(
        new AppError('All fields are required to update a product', 400),
      );
    }

    const product = await Product.findByIdAndUpdate(id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const user = await User.findById(req.user?.id);

    if (user?.role !== 'admin') {
      return next(
        new AppError('You are not authorized to update this product', 403),
      );
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;
    if (category) product.category = category;

    await product.save();

    res
      .status(200)
      .json({ message: 'Product updated successfully', data: { product } });
  },
);

export const deleteProduct = catchError(
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const user = await User.findById(req.user?.id);

    if (user?.role !== 'admin') {
      return next(
        new AppError('You are not authorized to delete this product', 403),
      );
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product deleted successfully' });
  },
);

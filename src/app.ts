import express, { Application, Request, Response } from 'express';
import { authRoutes } from './routes/auth';
import dotenv from 'dotenv';
import { postRoutes } from './routes/post';
import { productRoutes } from './routes/product';
import { orderRoutes } from './routes/order';
import { userRoutes } from './routes/user';

dotenv.config();

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// The Main Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the API!');
});

// Authentication routes
app.use('/auth', authRoutes);

// User routes
app.use('/users', userRoutes);

// Post routes
app.use('/posts', postRoutes);

// Product routes
app.use('/products', productRoutes);

// Order routes
app.use('/orders', orderRoutes);

export default app;

import express, { Application, Request, Response } from 'express';
import { authRoutes } from './routes/auth';
import dotenv from 'dotenv';
import { postRoutes } from './routes/post';

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

// Authentication routes
app.use('/posts', postRoutes);

export default app;

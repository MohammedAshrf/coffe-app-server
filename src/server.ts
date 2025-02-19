import app from './app';
import connectDB from './config/db';
import { VercelRequest, VercelResponse } from '@vercel/node';

connectDB(); // Ensure DB is connected

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res); // Pass request & response to Express
}

// import app from './app';
// import connectDB from './config/db';

// const PORT: number | string = process.env.PORT || 3000;

// console.log(
//   'MongoDB URI:',
//   process.env.MONGODB_URI?.replace(/:[^:]+@/, ':*****@'),
// ); // Hide password for security

// const startServer = async () => {
//   try {
//     await connectDB(); // Wait for DB connection
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1); // Exit the process on failure
//   }
// };

// startServer();

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  // Expecting the token in the format: "Bearer <token>"
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    // Verify token and cast the payload to our TokenPayload interface
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret',
    ) as TokenPayload;
    // Attach the decoded payload to the request object.
    // You may extend the Request interface to include a user property if needed.
    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default verifyToken;

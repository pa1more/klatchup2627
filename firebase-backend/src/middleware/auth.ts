import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { ApiError } from '../api/ApiError';

// Verify Firebase ID Token
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.error('Auth error:', error);
    res.status(401).json({
      message: error.message || 'Unauthorized',
      type: 'UNAUTHORIZED',
    });
  }
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

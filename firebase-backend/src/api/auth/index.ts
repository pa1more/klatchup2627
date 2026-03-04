import { Router, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { verifyAuth } from '../../middleware/auth';

const router = Router();

// POST /auth - Create auth token (Firebase handles this, but endpoint for compatibility)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: 'Phone number is required',
        type: 'VALIDATION_ERROR',
      });
    }

    // Firebase Auth handles phone verification on client side
    // This endpoint just returns confirmation that backend received it
    res.status(200).json({
      type: 'jwt',
      body: 'Auth handled by Firebase client SDK',
      message: 'OTP verification handled on client',
    });
  } catch (error: any) {
    console.error('Auth error:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// GET /auth/verify - Verify Firebase token (optional endpoint)
router.get('/verify', verifyAuth, async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: 'Token is valid',
      userId: req.user?.uid,
      type: 'TOKEN_VALID',
    });
  } catch (error: any) {
    res.status(401).json({
      message: 'Invalid token',
      type: 'UNAUTHORIZED',
    });
  }
});

export default router;

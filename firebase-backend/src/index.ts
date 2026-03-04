import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    type: err.type || 'ERROR',
  });
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes (will be imported here)
import authRoutes from './api/auth';
import profileRoutes from './api/profiles';
import checkInRoutes from './api/checkIn';
import locationRoutes from './api/location';
import chatRoutes from './api/chat';

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/checkin', checkInRoutes);
app.use('/location', locationRoutes);
app.use('/chat', chatRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found', type: 'NOT_FOUND' });
});

// Export as Cloud Function
export const api = functions.https.onRequest({ region: 'us-central1' }, app);

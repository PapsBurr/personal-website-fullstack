import rateLimiter from 'express-rate-limit';
import { AppError } from './errorHandler.js';

export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (_req, _res, next) => {
    next(new AppError('Too many requests from this IP. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED'));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const nasaLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  handler: (_req, _res, next) => {
    next(new AppError('Too many NASA API requests from this IP. Please try again in an hour.', 429, 'NASA_RATE_LIMIT_EXCEEDED'));
  },
  standardHeaders: true,
  legacyHeaders: false,
});
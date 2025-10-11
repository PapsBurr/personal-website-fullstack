import rateLimiter from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

export const apiLimiter = rateLimiter({
  windowMs: isTest ? 1000 : 15 * 60 * 1000, // 15 minutes
  max: isTest ? 5 : 100, 
  handler: (req, res, next) => {
    const error = new Error();
    error.name = 'RateLimitError';
    next(error);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const nasaLimiter = rateLimiter({
  windowMs: isTest ? 1000 : 60 * 60 * 1000, // 1 hour
  max: isTest ? 5 : 50, 
  handler: (req, res, next) => {
    const error = new Error();
    error.name = 'RateLimitError';
    next(error);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
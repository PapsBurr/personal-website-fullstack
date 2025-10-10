import rateLimiter from 'express-rate-limit';

export const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  handler: (req, res, next) => {
    const error = new Error();
    error.name = 'RateLimitError';
    next(error);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const nasaLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, 
  handler: (req, res, next) => {
    const error = new Error();
    error.name = 'RateLimitError';
    next(error);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
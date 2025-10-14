import cors from 'cors';
import { AppError } from './errorHandler.js';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000', 
      'https://nathanpons.com',
      'https://www.nathanpons.com'
    ];

    if (!origin) return callback(null, true); // Allow non-browser requests like Postman or curl

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new AppError(`Origin ${origin} not allowed by CORS policy`, 403, 'CORS_ORIGIN_NOT_ALLOWED'));
    }
  },
  credentials: true
};

export const corsMiddleware = cors(corsOptions);
export { corsOptions };
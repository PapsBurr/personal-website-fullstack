import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000', // dev url
      'https://nathanpons.com', // production url
      'https://www.nathanpons.com' // production www url

    ];

    if (!origin) return callback(null, true); // Allow non-browser requests like Postman or curl

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

export const corsMiddleware = cors(corsOptions);
export { corsOptions };
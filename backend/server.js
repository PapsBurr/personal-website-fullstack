import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import nasaRoutes from './src/routes/nasa.js';
import { apiLimiter, nasaLimiter } from './src/middleware/rateLimiter.js';
import { corsMiddleware } from './src/middleware/corsConfig.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// test github actions 13

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(corsMiddleware);

app.use('/api/', apiLimiter); // Apply rate limiting to all /api/ routes

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/nasa', nasaLimiter, nasaRoutes); // Apply specific rate limiting to NASA routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send(`Backend server running on port ${process.env.PORT || 5000}`);
});

// Error handling middleware
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
export const handler = serverless(app);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import nasaRoutes from './src/routes/nasa.js';
import { apiLimiter, nasaLimiter } from './src/middleware/rateLimiter.js';

dotenv.config();

const app = express();

// test github actions 7

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection and server start
if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'production') {
  // Only connect to MongoDB in non-production environments for now
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      startServer();
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      startServer(); // Start without MongoDB for now
    });
} else {
  console.log('No MongoDB URI provided / Backend started in production, starting without database');
  startServer();
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export const handler = serverless(app);

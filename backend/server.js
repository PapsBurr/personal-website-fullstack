import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import nasaRoutes from './src/routes/nasa.js';
import path from 'path';
import fs from 'fs';
import { apiLimiter, nasaLimiter } from './src/middleware/rateLimiter.js';
import { corsMiddleware } from './src/middleware/corsConfig.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// test github actions 15

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(corsMiddleware);

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/static/:filename', (req, res) => {
  const { filename } = req.params;
  const basePath = process.env.AWS_LAMBDA_FUNCTION_NAME ? '/var/task' : process.cwd();
  const filePath = path.join(basePath, 'public', filename);

  // Temporary logging to debug file serving issues
  console.log('Lambda Function Name:', process.env.AWS_LAMBDA_FUNCTION_NAME);
  console.log('Serving file from path:', filePath);
  console.log('Base Path:', basePath);
  console.log('Does file exist?', fs.existsSync(filePath));

  try {
    const publicDir = path.join(basePath, 'public');
    const files = fs.readdirSync(publicDir);
    console.log('Files in public directory:', files);
  } catch (err) {
    console.error('Error reading public directory:', err);
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const fileBuffer = fs.readFileSync(filePath);
    res.send(fileBuffer);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.use('/static', express.static('public'));
app.use('/api/nasa', nasaLimiter, nasaRoutes); // Apply specific rate limiting to NASA routes
app.use('/api/', apiLimiter); // Apply rate limiting to all /api/ routes

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
export const handler = serverless(app, {
  binary: ['image/jpeg', 'image/jpg']
});

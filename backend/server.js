import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import nasaRoutes from './src/routes/nasa.js';
import stream from 'stream';
import util from 'util';
import getStream from 'get-stream';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { apiLimiter, nasaLimiter } from './src/middleware/rateLimiter.js';
import { corsMiddleware } from './src/middleware/corsConfig.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// test github actions 16

const s3 = new S3Client({ region: "us-east-1" });
const STATIC_BUCKET_NAME = "personal-website-backend-v2-static-files-us-east-1";

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

app.get('/api/static/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const command = new GetObjectCommand({
      Bucket: STATIC_BUCKET_NAME,
      Key: filename,
    });
    const s3Response = await s3.send(command);

    // Use buffer to handle binary data since Lambda may have issues with streaming
    const buffer = await getStream.buffer(s3Response.Body);

    res.setHeader('Content-Type', s3Response.ContentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // Pipeline method to use if buffer doesn't work
    // const pipeline = util.promisify(stream.pipeline);
    // await pipeline(s3Response.Body, res);

    console.log(`Served file ${filename} from S3`);
    console.log('Content-Type:', s3Response.ContentType);
    console.log('Buffer:', buffer);

    res.end(buffer);
  } catch (err) {
    console.error('Error fetching file from S3:', err);
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
  binary: ['image/jpeg', 'image/png', 'image/gif']
});

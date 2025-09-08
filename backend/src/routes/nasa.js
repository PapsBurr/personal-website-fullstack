import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

const nasaApodSchema = {
  title: {
    trim: true,
    escape: true,
    isLength: {
      options: { min: 1, max: 200 },
      errorMessage: 'Title must be 1-200 characters'
    }
  },
  explanation: {
    trim: true,
    escape: true,
    isLength: {
      options: { min: 1, max: 5000 },
      errorMessage: 'Explanation too long'
    }
  },
  copyright: {
    optional: true,
    trim: true,
    escape: true
  },
  url: {
    isURL: {
      options: { 
        protocols: ['http', 'https'], 
        require_tld: true,
        require_protocol: true,
        host_whitelist: ['nasa.gov', 'api.nasa.gov', 'apod.nasa.gov']
      },
      errorMessage: 'Invalid URL'
    }
  },
  hdurl: {
    optional: true,
    isURL: {
      options: { 
        protocols: ['http', 'https'], 
        require_tld: true,
        require_protocol: true,
        host_whitelist: ['nasa.gov', 'api.nasa.gov', 'apod.nasa.gov']
      },
      errorMessage: 'Invalid URL'
    }
  },
  date: {
    isISO8601: true,
    toDate: true
  },
  media_type: {
    isIn: {
      options: [['image']],
      errorMessage: 'Media type must be image'
    }
  },
  service_version: {
    optional: true,
    isString: true
  }
};

const validateData = async (data, schema) => {
  const req = { body: data };
  const validationChain = checkSchema(schema, ['body'])

  await validationChain.run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new Error(`Validation error: ${JSON.stringify(errors.array())}`);
  }

  return data;
};

router.get('/apod', cacheMiddleware(3600), async (req, res) => {

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {

    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`, { signal: controller.signal });
    clearTimeout(timeoutId); // Clear timeout on success

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.statusText}`);
    }

    const rawData = await response.json();
    const data = await validateData(rawData, nasaApodSchema);

    res.json(data);

  } catch (error) {
    clearTimeout(timeoutId); // Clear timeout on error
    if (error.name === 'AbortError') {
      console.error('NASA APOD request timed out');
      return res.status(504).json({ error: 'NASA APOD request timed out' });
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      console.error('Network error fetching NASA APOD:', error);
      return res.status(503).json({ error: 'Network error fetching NASA APOD' });
    } else {
      console.error('Error fetching NASA APOD:', error);
      res.status(500).json({ error: 'Failed to fetch NASA APOD' });
    }
  }
});

export default router;

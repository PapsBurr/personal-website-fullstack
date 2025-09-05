import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export const cacheMiddleware = (duration = 3600) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`Cache hit for ${key}`);
      return res.json(cachedResponse);
    }

    console.log(`Cache miss for ${key}`);

    const originalJson = res.json;

    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, data, duration);
        console.log(`Response cached for ${key} for ${duration}s`);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

export const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    stats: cache.getStats()
  };
};
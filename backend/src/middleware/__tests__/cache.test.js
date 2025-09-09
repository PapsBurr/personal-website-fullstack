import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { cacheMiddleware } from '../cache.js';

describe('Cache Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { originalUrl: '/test-url' };
    res = {
      json: jest.fn(),
      statusCode: 200
    };
    next = jest.fn();
  });

  it('should call next() on cache miss', () => {
    const middleware = cacheMiddleware(3600);
    middleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });

  it('should return cached response on cache hit', () => {
    const middleware = cacheMiddleware(3600);
    const testData = { message: 'test' };
    
    // First request - cache miss
    middleware(req, res, next);
    res.json(testData); // Simulate successful response
    
    // Second request - should be cache hit
    const req2 = { originalUrl: '/test-url' };
    const res2 = { json: jest.fn() };
    const next2 = jest.fn();
    
    middleware(req2, res2, next2);
    
    expect(res2.json).toHaveBeenCalledWith(testData);
    expect(next2).not.toHaveBeenCalled();
  });
});
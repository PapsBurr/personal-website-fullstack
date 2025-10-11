import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { AppError, errorHandler } from '../errorHandler.js';

describe('AppError', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      url: '/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn(() => 'test-user-agent')
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();

    // jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an AppError with correct properties', () => {
    const error = new AppError('Test error', 400, 'TEST_ERROR');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test error',
      code: 'TEST_ERROR'
    });
  });

  it('should set status to "error" for 5xx status codes', () => {
    const error = new AppError('Server error', 500);
    
    expect(error.status).toBe('error');
    expect(error.statusCode).toBe(500);
  });

  it('should set status to "fail" for 4xx status codes', () => {
    const error = new AppError('Client error', 404);
    
    expect(error.status).toBe('fail');
    expect(error.statusCode).toBe(404);
  });
});

describe('errorHandler', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle AppError instances correctly', () => {
    const appError = new AppError('Test error', 400, 'TEST_ERROR');
    
    errorHandler(appError, req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test error',
      code: 'TEST_ERROR'
    });
  });

  it('should handle generic errors', () => {
    const genericError = new Error('Generic error');
    
    errorHandler(genericError, req, res, next);
    
    expect(console.error).toHaveBeenCalledWith('Unexpected error:', expect.objectContaining({
      message: 'Generic error'
    }));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!',
      code: 'INTERNAL_SERVER_ERROR'
    });
  });

  it('should handle non-Error objects', () => {
    const stringError = 'String error';
    
    errorHandler(stringError, req, res, next);
    
    expect(console.error).toHaveBeenCalledWith('Unexpected error:', stringError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!',
      code: 'INTERNAL_SERVER_ERROR'
    });
  });
});
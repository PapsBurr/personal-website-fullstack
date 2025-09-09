import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { AppError, errorHandler } from '../errorHandler.js';

describe('AppError', () => {
  it('should create an AppError with correct properties', () => {
    const message = 'Test error message';
    const statusCode = 400;
    
    const error = new AppError(message, statusCode);
    
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('fail'); // 4xx status codes
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
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
    const appError = new AppError('Test error', 400);
    
    errorHandler(appError, req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Test error'
    });
  });

  it('should handle generic errors', () => {
    const genericError = new Error('Generic error');
    
    errorHandler(genericError, req, res, next);
    
    expect(console.error).toHaveBeenCalledWith('Unexpected error:', genericError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!'
    });
  });

  it('should handle non-Error objects', () => {
    const stringError = 'String error';
    
    errorHandler(stringError, req, res, next);
    
    expect(console.error).toHaveBeenCalledWith('Unexpected error:', stringError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong!'
    });
  });
});
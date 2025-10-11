class AppError extends Error {
  constructor(message, statusCode, code=null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Specific error handling
  if (err.message && err.message.includes('CORS')) {
    error = handleCORSOriginError(err);
  }

  if (err.name === 'RateLimitError') {
    error = handleRateLimitError(err);
  }

  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    error = handleJSONSyntaxError(err);
  }

  // Send error response
  sendErrorResponse(error, res);
};

const handleCORSOriginError = () => 
  new AppError('Cross-Origin request blocked by CORS policy. Please request from an authorized domain', 403, 'CORS_ERROR');

const handleRateLimitError = () => 
  new AppError('Too many requests from this IP. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED');

const handleJSONSyntaxError = () => 
  new AppError('Invalid JSON syntax in request body.', 400, 'INVALID_JSON_SYNTAX');

const sendErrorResponse = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    code: error.code,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { 
        originalError: error.message,
        stack: error.stack 
      })
    });
  }
};

// Async error wrapper utility
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export { AppError, errorHandler, catchAsync };

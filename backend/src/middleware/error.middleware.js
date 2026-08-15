import { AppError } from '../utils/errors.js';
import config from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Zod Schema validation errors
  if (err.name === 'ZodError') {
    statusCode = 422;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
  }

  // Handle Prisma Database errors
  if (err.code && err.code.startsWith('P')) {
    // Basic Prisma DB mapping
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Unique constraint violation';
      errors = err.meta?.target ? { target: err.meta.target } : null;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = err.meta?.cause || 'Record not found';
    } else {
      statusCode = 500;
      message = 'Database error occurred';
    }
  }

  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    response.errors = errors;
  }

  if (config.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('Unhandled Error Stack:', err);
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
export default errorHandler;

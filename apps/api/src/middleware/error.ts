import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../lib/http.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    console.error({ path: req.path, method: req.method, err });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      details: err instanceof HttpError ? err.details : undefined
    }
  });
};

import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../lib/http.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function signAccessToken(payload: AuthenticatedUser) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Authentication required');
  }

  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as AuthenticatedUser;
    next();
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as AuthenticatedUser;
    } catch {
      req.user = undefined;
    }
  }
  next();
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new HttpError(401, 'Authentication required');
    if (req.user.permissions.includes('*') || req.user.permissions.includes(permission)) {
      next();
      return;
    }
    throw new HttpError(403, `Missing permission: ${permission}`);
  };
}

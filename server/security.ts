import { Request, Response, NextFunction } from 'express';

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potential XSS patterns
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

// SQL injection prevention
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const checkSQLInjection = (value: string): boolean => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
      /('|(\\')|(''))/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(value));
  };

  const validateObject = (obj: any): string[] => {
    const errors: string[] = [];
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (checkSQLInjection(value)) {
          errors.push(`Potentially unsafe content detected in field: ${key}`);
        }
        if (value.length > 2000) {
          errors.push(`Field ${key} exceeds maximum length`);
        }
      }
    });
    
    return errors;
  };

  if (req.body) {
    const errors = validateObject(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Input validation failed',
        details: errors
      });
    }
  }

  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.openai.com https://www.google-analytics.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self';"
  );

  // Other security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    console.log(`[${logData.timestamp}] ${logData.method} ${logData.url} ${logData.status} ${logData.duration}`);
    
    // Log suspicious activity
    if (res.statusCode >= 400) {
      console.warn('Suspicious request detected:', logData);
    }
  });

  next();
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting middleware
export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean expired entries
    Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    });
    
    const clientData = rateLimitStore.get(clientId);
    
    if (!clientData) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (now > clientData.resetTime) {
      rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    clientData.count++;
    next();
  };
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
};
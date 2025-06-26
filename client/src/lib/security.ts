// Security utilities for input validation and sanitization

// XSS prevention - sanitize HTML input
export function sanitizeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// SQL injection prevention - validate and escape SQL-like patterns
export function validateInput(input: string): boolean {
  // Block potential SQL injection patterns
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|'|"|<|>)/,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i
  ];
  
  return !sqlInjectionPatterns.some(pattern => pattern.test(input));
}

// Rate limiting for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove requests outside time window
    const validRequests = userRequests.filter(time => now - time < this.timeWindow);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Content Security Policy headers validation
export function validateCSP(): boolean {
  const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return meta !== null;
}

// Input validation for forms
export function validateFormInput(data: Record<string, any>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Check for malicious content
      if (!validateInput(value)) {
        errors.push(`${key} contains potentially unsafe content`);
      }
      
      // Check for excessive length
      if (value.length > 1000) {
        errors.push(`${key} exceeds maximum length`);
      }
      
      // Check for empty required fields
      if (value.trim().length === 0 && ['name', 'phone', 'message'].includes(key)) {
        errors.push(`${key} is required`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Phone number validation for Korean format
export function validatePhoneNumber(phone: string): boolean {
  const koreanPhoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  return koreanPhoneRegex.test(phone.replace(/\s+/g, ''));
}

// Session validation
export function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Environment check
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

// Safe JSON parsing
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch {
    return fallback;
  }
}
/**
 * Validation utilities for API requests
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function validateRequired(fields: { [key: string]: any }) {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateEmail(email: string) {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
}

export function validatePassword(password: string) {
  if (!isValidPassword(password)) {
    throw new Error('Password must be at least 6 characters long');
  }
}

/**
 * Sanitize user input by removing special characters
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Parse and validate JSON body from request
 */
export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

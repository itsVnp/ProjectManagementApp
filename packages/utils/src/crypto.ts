/**
 * Cryptographic utility functions
 */

/**
 * Generates a random string for tokens
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a string using SHA-256
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a hash from multiple values
 */
export async function createHash(...values: string[]): Promise<string> {
  const combined = values.join('|');
  return hashString(combined);
}

/**
 * Generates a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Encodes a string to base64
 */
export function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Decodes a base64 string
 */
export function decodeBase64(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

/**
 * Creates a simple hash for short strings
 */
export function simpleHash(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a password reset token
 */
export function generatePasswordResetToken(): string {
  return generateSecureToken(64);
}

/**
 * Generates an email verification token
 */
export function generateEmailVerificationToken(): string {
  return generateSecureToken(32);
}

/**
 * Generates an API key
 */
export function generateApiKey(): string {
  return `claro_${generateSecureToken(32)}`;
}

/**
 * Validates a token format
 */
export function isValidToken(token: string): boolean {
  return /^[A-Za-z0-9]{32,}$/.test(token);
}

/**
 * Masks sensitive data
 */
export function maskSensitiveData(data: string, type: 'email' | 'phone' | 'credit-card'): string {
  switch (type) {
    case 'email':
      const [local, domain] = data.split('@');
      if (local.length <= 2) return data;
      return `${local.charAt(0)}${'*'.repeat(local.length - 2)}${local.charAt(local.length - 1)}@${domain}`;
    
    case 'phone':
      if (data.length <= 4) return data;
      return `${data.slice(0, 2)}${'*'.repeat(data.length - 4)}${data.slice(-2)}`;
    
    case 'credit-card':
      if (data.length <= 4) return data;
      return `${'*'.repeat(data.length - 4)}${data.slice(-4)}`;
    
    default:
      return data;
  }
}

/**
 * Generates a checksum for data integrity
 */
export function generateChecksum(data: string): string {
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum += data.charCodeAt(i);
  }
  return checksum.toString(16);
}

/**
 * Validates a checksum
 */
export function validateChecksum(data: string, checksum: string): boolean {
  return generateChecksum(data) === checksum;
} 
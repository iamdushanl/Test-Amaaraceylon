import { TOKEN_KEYS } from "./auth-config";

/**
 * Store authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
  }
}

/**
 * Retrieve authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  }
  return null;
}

/**
 * Clear authentication tokens
 */
export function clearAuthTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER_ID);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain number");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain special character (!@#$%^&*)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

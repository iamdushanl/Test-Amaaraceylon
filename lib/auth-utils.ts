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
 * Logout user and clear all authentication data
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint if available
    const token = getAuthToken();
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        // Silently fail - proceed with local logout
        console.debug("Logout API call failed, clearing local tokens");
      }
    }
  } finally {
    // Always clear local tokens
    clearAuthTokens();
  }
}

/**
 * Restore authentication session (e.g., on page reload)
 */
export function restoreSession(): { isAuthenticated: boolean; expired: boolean } {
  const token = getAuthToken();
  
  if (!token) {
    return { isAuthenticated: false, expired: false };
  }
  
  const expired = isTokenExpired();
  
  if (expired) {
    clearAuthTokens();
    return { isAuthenticated: false, expired: true };
  }
  
  return { isAuthenticated: true, expired: false };
}

/**
 * Store refresh token
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  }
}

/**
 * Retrieve refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }
  return null;
}

/**
 * Store user ID
 */
export function setUserId(userId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEYS.USER_ID, userId);
  }
}

/**
 * Retrieve user ID
 */
export function getUserId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEYS.USER_ID);
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Check if token has expired
 */
export function isTokenExpired(): boolean {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    // Decode JWT token to get expiration
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const decoded = JSON.parse(atob(parts[1]));
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
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

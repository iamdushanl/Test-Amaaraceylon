// Authentication API endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  REFRESH: "/api/auth/refresh",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESET_PASSWORD: "/api/auth/reset-password",
  CONFIRM_PASSWORD: "/api/auth/confirm-password",
} as const;

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: "amaara_access_token",
  REFRESH_TOKEN: "amaara_refresh_token",
  USER_ID: "amaara_user_id",
} as const;

// Session timeout (in minutes)
export const SESSION_TIMEOUT = 60;

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL: true,
} as const;

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password does not meet requirements",
  PASSWORD_MISMATCH: "Passwords do not match",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_ALREADY_EXISTS: "An account with this email already exists",
  SESSION_EXPIRED: "Your session has expired. Please log in again",
  NETWORK_ERROR: "Network error. Please try again.",
} as const;

/**
 * Validate required environment variables at build time
 * Throws error if critical env vars are missing
 */
export function validateAuthEnvironment(): void {
  const requiredEnvVars = ["NEXT_PUBLIC_API_BASE_URL"];
  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
      `Please check your .env.local file.`
    );
  }
}

/**
 * Get the API base URL from environment
 * Validates that the URL is properly formatted
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  try {
    new URL(baseUrl);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_API_BASE_URL format: ${baseUrl}\n` +
      `Expected a valid URL like http://localhost:3000 or https://api.example.com`
    );
  }

  return baseUrl.replace(/\/$/, ""); // Remove trailing slash
}


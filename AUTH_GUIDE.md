# Amaara Restaurant Website - Authentication Guide

## Overview

Amaara now includes a complete user authentication system with login and registration pages. Users can create accounts, log in securely, and manage their reservations.

## Features

- **User Registration**: Create new accounts with email and password
- **User Login**: Secure login with email and password authentication
- **Password Validation**: Strong password requirements enforced
- **Form Validation**: Real-time form validation and error handling
- **Authentication Utilities**: Helper functions for token management
- **Auth Navigation**: Easy access to login and registration from the main page

## Getting Started

### Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure the required environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   JWT_SECRET=your-secret-key-here
   ```

## Authentication Pages

### Login Page (`/login`)
- Email and password fields
- "Remember me" option
- Forgot password link
- Social login options (Google, Apple)
- Link to registration page

### Registration Page (`/register`)
- Full name, email, and password fields
- Password confirmation
- Terms & Conditions acceptance
- Real-time validation
- Link to login page

## Password Requirements

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

## Custom Hooks

### `useForm`
A custom React hook for managing form state, validation, and submission:

```typescript
const {
  values,
  errors,
  isLoading,
  handleChange,
  handleSubmit,
  resetForm,
} = useForm(initialValues, onSubmit);
```

## Utility Functions

### Token Management
```typescript
import { setAuthToken, getAuthToken, clearAuthTokens } from "@/lib/auth-utils";

setAuthToken(token);        // Store token
const token = getAuthToken(); // Retrieve token
clearAuthTokens();          // Clear all tokens
```

### Validation
```typescript
import { validatePassword, validateEmail } from "@/lib/auth-utils";

const { isValid, errors } = validatePassword(password);
const isValidEmail = validateEmail(email);
```

## API Routes

The following API routes should be implemented:

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh authentication token
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/confirm-password` - Confirm new password

## File Structure

```
app/
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Registration page
components/
├── AuthNav.tsx               # Authentication navigation
lib/
├── auth-config.ts            # Auth configuration and constants
├── auth-utils.ts             # Auth utility functions
└── types.ts                  # TypeScript type definitions
hooks/
└── useForm.ts                # Custom form handling hook
```

## Security Considerations

- Passwords are never logged or sent in plain text
- Tokens should be stored securely (HTTP-only cookies recommended)
- HTTPS should be used in production
- Implement CSRF protection for all forms
- Sanitize user inputs to prevent XSS attacks

## Next Steps

1. Implement backend API authentication endpoints
2. Add database schema for users
3. Configure JWT token generation and validation
4. Set up email verification for new accounts
5. Implement password reset functionality
6. Add two-factor authentication (optional)

## Support

For issues or questions, please check the main README.md or contact the development team.

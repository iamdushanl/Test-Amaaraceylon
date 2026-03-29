/**
 * Form validation utilities for common input validation patterns
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Phone number validation (supports US and international formats)
 * Accepts formats: +1 (123) 456-7890, +44 20 1234 5678, 123-456-7890, etc.
 */
export function validatePhone(phone: string): ValidationResult {
  const cleanPhone = phone.replace(/[\s\-().]/g, "");
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
  if (!phone.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }
  
  return { isValid: true };
}

/**
 * Reservation date validation
 * Validates that date is in the future or today, and is a valid date
 * For same-day reservations, also checks if time is valid
 */
export function validateReservationDate(dateString: string, timeString?: string): ValidationResult {
  if (!dateString.trim()) {
    return { isValid: false, error: "Date is required" };
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  if (date < today) {
    return { isValid: false, error: "Please select a future date" };
  }

  // If same day and time provided, validate time is not in the past
  if (date.getTime() === today.getTime() && timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    const requestedTime = new Date();
    requestedTime.setHours(hours, minutes, 0);

    if (requestedTime <= now) {
      return { isValid: false, error: "Please select a future time" };
    }
  }

  return { isValid: true };
}

/**
 * Reservation time validation
 * Validates that time is within business hours (11 AM - 10 PM)
 */
export function validateReservationTime(timeString: string): ValidationResult {
  if (!timeString.trim()) {
    return { isValid: false, error: "Time is required" };
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    return { isValid: false, error: "Please enter a valid time" };
  }

  const totalMinutes = hours * 60 + minutes;
  const openingMinutes = 11 * 60; // 11 AM
  const closingMinutes = 22 * 60; // 10 PM

  if (totalMinutes < openingMinutes || totalMinutes > closingMinutes) {
    return { isValid: false, error: "Reservations are available from 11 AM to 10 PM" };
  }

  return { isValid: true };
}

/**
 * Guest count validation
 */
export function validateGuestCount(count: number | string): ValidationResult {
  const numCount = typeof count === "string" ? parseInt(count) : count;

  if (isNaN(numCount)) {
    return { isValid: false, error: "Please enter a valid guest count" };
  }

  if (numCount < 1) {
    return { isValid: false, error: "At least 1 guest is required" };
  }

  if (numCount > 12) {
    return { isValid: false, error: "Maximum 12 guests per reservation" };
  }

  return { isValid: true };
}

/**
 * Special requests validation
 */
export function validateSpecialRequests(requests: string): ValidationResult {
  if (requests && requests.length > 500) {
    return { isValid: false, error: "Special requests must be 500 characters or less" };
  }

  return { isValid: true };
}

/**
 * Name validation
 */
export function validateName(name: string): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (name.length > 100) {
    return { isValid: false, error: "Name must be less than 100 characters" };
  }

  return { isValid: true };
}

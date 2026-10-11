/**
 * profileValidation.ts
 * Pure validator functions for all input fields in Section 6.
 * Each returns { valid: boolean, message: string }
 */

interface ValidationResult {
  valid: boolean;
  message: string;
}

// ─── Phone (10-digit numeric) ─────────────────────────────────────────────
export function validatePhone(value: string): ValidationResult {
  if (!value) return { valid: false, message: 'Phone number is required' };
  const regex = /^[0-9]{10}$/;
  if (!regex.test(value)) return { valid: false, message: 'Must be exactly 10 digits' };
  return { valid: true, message: '' };
}

// ─── Email ────────────────────────────────────────────────────────────────
export function validateEmail(value: string): ValidationResult {
  if (!value) return { valid: false, message: 'Email is required' };
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) return { valid: false, message: 'Invalid email format' };
  return { valid: true, message: '' };
}

// ─── Aadhaar (12-digit numeric) ───────────────────────────────────────────
export function validateAadhaar(value: string): ValidationResult {
  if (!value) return { valid: false, message: 'Aadhaar number is required' };
  const regex = /^[0-9]{12}$/;
  if (!regex.test(value)) return { valid: false, message: 'Must be exactly 12 digits' };
  return { valid: true, message: '' };
}

// ─── PAN (Alphanumeric: ABCDE1234F) ──────────────────────────────────────
export function validatePAN(value: string): ValidationResult {
  if (!value) return { valid: true, message: '' };
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!regex.test(value.toUpperCase())) return { valid: false, message: 'Invalid PAN format (e.g. ABCDE1234F)' };
  return { valid: true, message: '' };
}

// ─── Percentage (0–100) ───────────────────────────────────────────────────
export function validatePercentage(value: string | number, fieldName = 'Percentage'): ValidationResult {
  if (value === '' || value === null || value === undefined) return { valid: false, message: `${fieldName} is required` };
  const num = parseFloat(String(value));
  if (isNaN(num)) return { valid: false, message: 'Must be a number' };
  if (num < 0 || num > 100) return { valid: false, message: 'Must be between 0 and 100' };
  return { valid: true, message: '' };
}

// ─── CGPA (0–10) ──────────────────────────────────────────────────────────
export function validateCGPA(value: string | number): ValidationResult {
  if (value === '' || value === null || value === undefined) return { valid: false, message: 'CGPA is required' };
  const num = parseFloat(String(value));
  if (isNaN(num)) return { valid: false, message: 'Must be a number' };
  if (num < 0 || num > 10) return { valid: false, message: 'Must be between 0.00 and 10.00' };
  return { valid: true, message: '' };
}

// ─── Passing Year (4-digit plausible year) ────────────────────────────────
export function validatePassingYear(value: string | number): ValidationResult {
  if (!value) return { valid: false, message: 'Passing year is required' };
  const regex = /^[0-9]{4}$/;
  if (!regex.test(String(value))) return { valid: false, message: 'Must be a 4-digit year' };
  const year = parseInt(String(value), 10);
  if (year < 2010 || year > 2035) return { valid: false, message: 'Year must be between 2010 and 2035' };
  return { valid: true, message: '' };
}

// ─── URL ──────────────────────────────────────────────────────────────────
export function validateURL(value: string, fieldName = 'URL'): ValidationResult {
  if (!value) return { valid: true, message: '' };
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    return { valid: true, message: '' };
  } catch {
    return { valid: false, message: `Invalid ${fieldName} format` };
  }
}

// ─── Required text field ──────────────────────────────────────────────────
export function validateRequired(value: string | number, fieldName = 'This field'): ValidationResult {
  if (!value || !String(value).trim()) return { valid: false, message: `${fieldName} is required` };
  return { valid: true, message: '' };
}

// ─── Input Masks ──────────────────────────────────────────────────────────
export function maskNumericOnly(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

export function maskPAN(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10);
}

export function maskPhone(value: string): string {
  return value.replace(/[^0-9]/g, '').slice(0, 10);
}

export function maskAadhaar(value: string): string {
  return value.replace(/[^0-9]/g, '').slice(0, 12);
}

// ─── PDF File Validation ──────────────────────────────────────────────────
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateResumeFile(file: File | null): ValidationResult {
  if (!file) return { valid: false, message: 'No file selected' };

  const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPDF) return { valid: false, message: 'Only PDF files are accepted' };

  if (file.size > MAX_RESUME_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, message: `File size (${sizeMB} MB) exceeds 5 MB limit` };
  }

  return { valid: true, message: '' };
}

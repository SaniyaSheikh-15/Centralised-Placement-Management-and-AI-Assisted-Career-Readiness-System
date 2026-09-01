export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[6-9]\d{9}$/;
export const PASSWORD_PATTERN = /^(?=.*\d).{8,}$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (trimmed === "") {
    return "Email address is required.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validateOfficialEmail(email: string): string | null {
  const trimmed = email.trim();
  if (trimmed === "") {
    return "Official email is required.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validateInstitutionalEmail(email: string): string | null {
  const trimmed = email.trim();
  if (trimmed === "") {
    return "Institutional email is required.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (trimmed === "") {
    return "Phone number is required.";
  }
  if (!PHONE_PATTERN.test(trimmed)) {
    return "Enter a valid 10-digit phone number.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password === "") {
    return "Password is required.";
  }
  if (!PASSWORD_PATTERN.test(password)) {
    return "Password must contain 8 characters and at least one number.";
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (confirmPassword === "") {
    return "Please confirm your password.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}

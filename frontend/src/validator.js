// This file contains the validation functions. We use 'export' for React.

export function validateName(name) {
  return typeof name === "string" && name.length >= 20 && name.length <= 60;
}

export function validateAddress(address) {
  // Address must not be empty and must be under the character limit.
  return typeof address === "string" && address.length > 0 && address.length <= 400;
}

export function validatePassword(password) {
  // Requires 8-16 characters, at least one uppercase letter, and one special character.
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  return passwordRegex.test(password);
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
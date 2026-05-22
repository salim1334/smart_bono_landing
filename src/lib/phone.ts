/** Normalize Ethiopian phone numbers to 09XXXXXXXXX for storage. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.startsWith("251")) return `+${digits}`;
  if (digits.startsWith("0")) return `09${digits.slice(1)}`;
  if (digits.length === 9) return `09${digits}`;
  return `+${digits}`;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9;
}

/** Use in live form validation (normalizes first; works with spaces, 09…, 09…). */
export function isValidPhoneInput(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  return isValidPhone(normalizePhone(trimmed));
}

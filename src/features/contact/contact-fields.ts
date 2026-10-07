/**
 * Field names, limits and error codes of the contact form. Kept free of Zod so client components
 * can use them without pulling the validation library into the initial bundle.
 */

export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

/** Message keys under `contact.errors` in the translation files. */
export type ContactValidationError =
  "nameTooShort" | "nameTooLong" | "emailInvalid" | "messageTooShort" | "messageTooLong";

export type ContactFieldErrors = Partial<Record<ContactField, ContactValidationError>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 5000 },
} as const;

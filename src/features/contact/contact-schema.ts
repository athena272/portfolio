import { z } from "zod";

import type { Locale } from "@/i18n/routing";

import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  type ContactField,
  type ContactFieldErrors,
  type ContactValidationError,
} from "./contact-fields";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "nameTooShort" satisfies ContactValidationError)
    .max(CONTACT_LIMITS.name.max, "nameTooLong" satisfies ContactValidationError),
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "emailInvalid" satisfies ContactValidationError })),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, "messageTooShort" satisfies ContactValidationError)
    .max(CONTACT_LIMITS.message.max, "messageTooLong" satisfies ContactValidationError),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** JSON body of `POST /api/contact`, shared by the form and the route handler. */
export type ContactRequestBody = ContactInput & {
  /** Honeypot field. Real visitors leave it empty, so a filled value means a bot. */
  honeypot: string;
  /** Language of the page, so the reply can be written in it. */
  locale?: Locale;
};

export type ContactValidationResult =
  { success: true; data: ContactInput } | { success: false; errors: ContactFieldErrors };

/** Validates raw form values and keeps only the first error of each field. */
export function validateContact(values: Record<ContactField, string>): ContactValidationResult {
  const result = contactSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (isContactField(field) && !errors[field]) {
      errors[field] = issue.message as ContactValidationError;
    }
  }
  return { success: false, errors };
}

function isContactField(value: unknown): value is ContactField {
  return typeof value === "string" && (CONTACT_FIELDS as readonly string[]).includes(value);
}

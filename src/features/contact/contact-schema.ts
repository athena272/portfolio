import { z } from "zod";

import type { Locale } from "@/i18n/routing";

export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

/** Message keys under `contact.errors` in the translation files. */
export type ContactValidationError =
  "nameTooShort" | "nameTooLong" | "emailInvalid" | "messageTooShort" | "messageTooLong";

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 5000 },
} as const;

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
export type ContactFieldErrors = Partial<Record<ContactField, ContactValidationError>>;

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

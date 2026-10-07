import type { validateContact } from "./contact-schema";

export type ContactValidator = typeof validateContact;
export type ContactValidatorLoader = () => Promise<ContactValidator>;

type ContactSchemaModule = { validateContact: ContactValidator };

/**
 * Creates a loader that downloads the validator module on first use. The result is cached after it
 * loads; a failed download is forgotten so the next call retries instead of failing forever.
 */
export function createContactValidatorLoader(
  importSchema: () => Promise<ContactSchemaModule>,
): ContactValidatorLoader {
  let pending: Promise<ContactValidator> | null = null;

  return () => {
    pending ??= importSchema().then(
      (module) => module.validateContact,
      (error: unknown) => {
        pending = null;
        throw error;
      },
    );
    return pending;
  };
}

/** Keeps Zod out of the initial page bundle: it is only fetched once the visitor uses the form. */
export const loadContactValidator = createContactValidatorLoader(() => import("./contact-schema"));

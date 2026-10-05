import { siteConfig } from "@/lib/site-config";

import type { ContactRequestBody } from "./contact-schema";

/** Message keys under `contact.errors` in the translation files. */
export type SubmitContactFailure = "timeout" | "network" | "server" | "rejected";

export type SubmitContactResult = { ok: true } | { ok: false; reason: SubmitContactFailure };

export type ContactSubmission = Omit<ContactRequestBody, "honeypot"> & { honeypot?: string };

type SubmitContactOptions = {
  endpoint?: string;
  timeoutMs?: number;
};

/**
 * Sends the message to the contact route handler, which emails it through Resend.
 * Never throws: every failure is mapped to a reason the UI can explain to the user.
 */
export async function submitContact(
  { honeypot = "", ...submission }: ContactSubmission,
  {
    endpoint = siteConfig.contactEndpoint,
    timeoutMs = siteConfig.contactTimeoutMs,
  }: SubmitContactOptions = {},
): Promise<SubmitContactResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const body: ContactRequestBody = { ...submission, honeypot };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      signal: controller.signal,
    });

    if (response.ok) return { ok: true };
    return { ok: false, reason: isRetryableStatus(response.status) ? "server" : "rejected" };
  } catch {
    return { ok: false, reason: controller.signal.aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRetryableStatus(status: number): boolean {
  return status >= 500 || status === 429 || status === 408;
}

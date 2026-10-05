import { Resend } from "resend";

import { siteConfig } from "@/lib/site-config";

import type { EmailContent } from "./contact-message-email";

/** Kept below the client timeout so the visitor gets the server's answer instead of a generic one. */
export const MAIL_SEND_TIMEOUT_MS = 8_000;

/** Resend's shared sender only delivers to the account owner. A verified domain lifts that limit. */
export const DEFAULT_MAIL_FROM = "Portfólio Guilherme <onboarding@resend.dev>";

export type SendContactEmailResult = "sent" | "unconfigured" | "failed" | "timeout";

export type MailSettings = {
  apiKey: string | undefined;
  from: string;
  to: string;
};

type SendContactEmailOptions = {
  settings?: MailSettings;
  timeoutMs?: number;
};

export function readMailSettings(env: NodeJS.ProcessEnv = process.env): MailSettings {
  return {
    apiKey: env.RESEND_API_KEY?.trim() || undefined,
    from: env.MAIL_FROM?.trim() || DEFAULT_MAIL_FROM,
    to: siteConfig.email,
  };
}

/**
 * Delivers the contact message to the site owner, with the visitor as `Reply-To`.
 * Never throws: a lost contact message must reach the visitor as an error, so every outcome
 * is returned, and failures are logged for the deploy logs.
 */
export async function sendContactEmail(
  content: EmailContent,
  replyTo: string,
  { settings = readMailSettings(), timeoutMs = MAIL_SEND_TIMEOUT_MS }: SendContactEmailOptions = {},
): Promise<SendContactEmailResult> {
  if (!settings.apiKey) {
    console.error("[contact] RESEND_API_KEY is not set; the message was not sent.");
    return "unconfigured";
  }

  const signal = AbortSignal.timeout(timeoutMs);
  try {
    // The SDK reports HTTP, network and abort failures in `error` instead of throwing.
    const { error } = await new Resend(settings.apiKey).emails.send(
      {
        from: settings.from,
        to: settings.to,
        replyTo,
        subject: content.subject,
        html: content.html,
        text: content.text,
      },
      { signal },
    );

    if (!error) return "sent";
    return logFailure(signal, `${error.name}: ${error.message}`, timeoutMs);
  } catch (error) {
    return logFailure(signal, error instanceof Error ? error.message : String(error), timeoutMs);
  }
}

function logFailure(signal: AbortSignal, detail: string, timeoutMs: number): "failed" | "timeout" {
  if (signal.aborted) {
    console.error(`[contact] Resend did not answer within ${timeoutMs} ms.`);
    return "timeout";
  }
  console.error(`[contact] The message was not sent: ${detail}`);
  return "failed";
}

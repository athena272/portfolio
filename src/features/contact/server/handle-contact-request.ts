import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

import { validateContact, type ContactRequestBody } from "../contact-schema";
import { buildContactMessageEmail } from "./contact-message-email";
import { sendContactEmail, type SendContactEmailResult } from "./send-contact-email";

type ContactRequestDependencies = {
  send?: typeof sendContactEmail;
  now?: () => Date;
  siteUrl?: string;
};

type UntrustedBody = Partial<Record<keyof ContactRequestBody, unknown>>;

const STATUS_BY_RESULT: Record<SendContactEmailResult, number> = {
  sent: 200,
  unconfigured: 503,
  failed: 502,
  timeout: 504,
};

/**
 * Body of `POST /api/contact`. The form is validated again here because the browser can't be
 * trusted, and the email is only sent with the server-side API key.
 */
export async function handleContactRequest(
  request: Request,
  {
    send = sendContactEmail,
    now = () => new Date(),
    siteUrl = siteConfig.url,
  }: ContactRequestDependencies = {},
): Promise<Response> {
  const body = await readJsonObject(request);
  if (!body) return Response.json({ ok: false }, { status: 400 });

  const validation = validateContact({
    name: asString(body.name),
    email: asString(body.email),
    message: asString(body.message),
  });
  if (!validation.success) {
    return Response.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  // Bots that fill the hidden field get a success response, so they have no reason to retry.
  if (asString(body.honeypot)) return Response.json({ ok: true });

  const locale = hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;
  const content = buildContactMessageEmail({
    ...validation.data,
    locale,
    receivedAt: now(),
    siteUrl,
  });
  const status = STATUS_BY_RESULT[await send(content, validation.data.email)];

  return Response.json({ ok: status === 200 }, { status });
}

async function readJsonObject(request: Request): Promise<UntrustedBody | null> {
  try {
    const body: unknown = await request.json();
    return typeof body === "object" && body !== null && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

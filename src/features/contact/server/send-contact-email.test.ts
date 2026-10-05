// @vitest-environment node
// Runs the real Resend SDK against a mocked HTTP API, so the request it sends is verified too.
import { delay, http, HttpResponse } from "msw";

import { server } from "@/test/msw-server";

import {
  DEFAULT_MAIL_FROM,
  readMailSettings,
  sendContactEmail,
  type MailSettings,
} from "./send-contact-email";

const RESEND_EMAILS_URL = "https://api.resend.com/emails";

const content = { subject: "Assunto", html: "<p>Oi</p>", text: "Oi" };
const settings: MailSettings = {
  apiKey: "re_test",
  from: "Portfólio <contato@exemplo.com>",
  to: "dono@exemplo.com",
};

describe("readMailSettings", () => {
  it("reads the API key and sender from the environment", () => {
    expect(
      readMailSettings({ RESEND_API_KEY: " re_123 ", MAIL_FROM: "Eu <eu@exemplo.com>" } as never),
    ).toEqual({ apiKey: "re_123", from: "Eu <eu@exemplo.com>", to: "guilhermera272@gmail.com" });
  });

  it("falls back to Resend's shared sender and treats a blank key as missing", () => {
    expect(readMailSettings({ RESEND_API_KEY: "  " } as never)).toEqual({
      apiKey: undefined,
      from: DEFAULT_MAIL_FROM,
      to: "guilhermera272@gmail.com",
    });
  });
});

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("sends to the owner, authenticated, with the visitor as reply-to", async () => {
    let received: { authorization: string | null; body: unknown } | undefined;
    server.use(
      http.post(RESEND_EMAILS_URL, async ({ request }) => {
        received = {
          authorization: request.headers.get("authorization"),
          body: await request.json(),
        };
        return HttpResponse.json({ id: "email_1" });
      }),
    );

    await expect(sendContactEmail(content, "ana@empresa.com", { settings })).resolves.toBe("sent");
    expect(received?.authorization).toBe("Bearer re_test");
    expect(received?.body).toMatchObject({
      from: settings.from,
      to: settings.to,
      reply_to: "ana@empresa.com",
      ...content,
    });
  });

  it("reports a missing API key instead of pretending the message was sent", async () => {
    await expect(
      sendContactEmail(content, "ana@empresa.com", {
        settings: { ...settings, apiKey: undefined },
      }),
    ).resolves.toBe("unconfigured");
  });

  it("maps an error answered by Resend to 'failed'", async () => {
    server.use(
      http.post(RESEND_EMAILS_URL, () =>
        HttpResponse.json(
          { name: "validation_error", message: "Invalid `from` field.", statusCode: 422 },
          { status: 422 },
        ),
      ),
    );

    await expect(sendContactEmail(content, "ana@empresa.com", { settings })).resolves.toBe(
      "failed",
    );
    expect(console.error).toHaveBeenCalledWith(
      "[contact] The message was not sent: validation_error: Invalid `from` field.",
    );
  });

  it("maps a network failure to 'failed'", async () => {
    server.use(http.post(RESEND_EMAILS_URL, () => HttpResponse.error()));

    await expect(sendContactEmail(content, "ana@empresa.com", { settings })).resolves.toBe(
      "failed",
    );
  });

  it("aborts the request when Resend takes too long", async () => {
    server.use(
      http.post(RESEND_EMAILS_URL, async () => {
        await delay("infinite");
        return HttpResponse.json({ id: "email_1" });
      }),
    );

    await expect(
      sendContactEmail(content, "ana@empresa.com", { settings, timeoutMs: 50 }),
    ).resolves.toBe("timeout");
  });
});

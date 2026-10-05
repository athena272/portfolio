// @vitest-environment node
import { handleContactRequest } from "./handle-contact-request";
import type { sendContactEmail } from "./send-contact-email";

const validBody = {
  name: "Ana Souza",
  email: "ana@empresa.com",
  message: "Olá! Gostaria de conversar sobre uma vaga.",
  honeypot: "",
  locale: "en",
};

function contactRequest(body: unknown): Request {
  return new Request("https://portfolio.test/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function handle(body: unknown, result: Awaited<ReturnType<typeof sendContactEmail>> = "sent") {
  const send = vi.fn<typeof sendContactEmail>().mockResolvedValue(result);
  const response = handleContactRequest(contactRequest(body), {
    send,
    now: () => new Date("2026-10-05T14:56:00Z"),
    siteUrl: "https://portfolio.test",
  });
  return { send, response };
}

describe("handleContactRequest", () => {
  it("emails the validated message with the visitor as reply-to", async () => {
    const { send, response } = handle({ ...validBody, name: "  Ana Souza  " });

    const res = await response;
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });

    const [content, replyTo] = send.mock.calls[0] ?? [];
    expect(replyTo).toBe("ana@empresa.com");
    expect(content?.subject).toBe("Nova mensagem pelo portfólio: Ana Souza");
    expect(content?.text).toContain("Idioma do site: Inglês");
    expect(content?.text).toContain(validBody.message);
  });

  it("validates again on the server and returns the field errors", async () => {
    const { send, response } = handle({ ...validBody, email: "invalido", message: "curta" });

    const res = await response;
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      ok: false,
      errors: { email: "emailInvalid", message: "messageTooShort" },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([["not json"], [["an", "array"]], [null]])(
    "rejects a body that is not a JSON object (%j)",
    async (body) => {
      const { send, response } = handle(body);
      expect((await response).status).toBe(400);
      expect(send).not.toHaveBeenCalled();
    },
  );

  it("answers bots that fill the honeypot with success without sending anything", async () => {
    const { send, response } = handle({ ...validBody, honeypot: "http://spam.example" });

    expect((await response).status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("falls back to Portuguese when the locale is missing or unknown", async () => {
    const { send, response } = handle({ ...validBody, locale: "fr" });

    await response;
    expect(send.mock.calls[0]?.[0].text).toContain("Idioma do site: Português");
  });

  it.each([
    ["unconfigured", 503],
    ["failed", 502],
    ["timeout", 504],
  ] as const)("maps a '%s' delivery to HTTP %i", async (result, status) => {
    const { response } = handle(validBody, result);

    const res = await response;
    expect(res.status).toBe(status);
    await expect(res.json()).resolves.toEqual({ ok: false });
  });
});

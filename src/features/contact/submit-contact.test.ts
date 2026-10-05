// @vitest-environment node
// Node's fetch needs an absolute URL, so the suite passes one instead of the relative route.
import { delay, http, HttpResponse } from "msw";

import { server } from "@/test/msw-server";

import { submitContact } from "./submit-contact";

const ENDPOINT = "https://portfolio.test/api/contact";

const submission = {
  name: "Ana Souza",
  email: "ana@empresa.com",
  message: "Olá! Gostaria de conversar sobre uma vaga.",
};

describe("submitContact", () => {
  it("posts the message as JSON to the contact route and resolves ok on 2xx", async () => {
    let received: { contentType: string | null; body: unknown } | undefined;

    server.use(
      http.post(ENDPOINT, async ({ request }) => {
        received = {
          contentType: request.headers.get("content-type"),
          body: await request.json(),
        };
        return HttpResponse.json({ ok: true });
      }),
    );

    await expect(
      submitContact({ ...submission, locale: "en" }, { endpoint: ENDPOINT }),
    ).resolves.toEqual({ ok: true });
    expect(received).toEqual({
      contentType: "application/json",
      body: { ...submission, honeypot: "", locale: "en" },
    });
  });

  it("forwards the honeypot value so the server can discard spam", async () => {
    let honeypot: unknown;
    server.use(
      http.post(ENDPOINT, async ({ request }) => {
        honeypot = ((await request.json()) as { honeypot?: unknown }).honeypot;
        return HttpResponse.json({ ok: true });
      }),
    );

    await submitContact({ ...submission, honeypot: "bot" }, { endpoint: ENDPOINT });
    expect(honeypot).toBe("bot");
  });

  it.each([400, 403, 422])("maps HTTP %i to 'rejected'", async (status) => {
    server.use(http.post(ENDPOINT, () => new HttpResponse(null, { status })));
    await expect(submitContact(submission, { endpoint: ENDPOINT })).resolves.toEqual({
      ok: false,
      reason: "rejected",
    });
  });

  it.each([408, 429, 500, 502, 503, 504])(
    "maps HTTP %i to 'server' so the user can retry",
    async (status) => {
      server.use(http.post(ENDPOINT, () => new HttpResponse(null, { status })));
      await expect(submitContact(submission, { endpoint: ENDPOINT })).resolves.toEqual({
        ok: false,
        reason: "server",
      });
    },
  );

  it("maps network failures to 'network'", async () => {
    server.use(http.post(ENDPOINT, () => HttpResponse.error()));
    await expect(submitContact(submission, { endpoint: ENDPOINT })).resolves.toEqual({
      ok: false,
      reason: "network",
    });
  });

  it("aborts slow requests and maps them to 'timeout'", async () => {
    server.use(
      http.post(ENDPOINT, async () => {
        await delay("infinite");
        return HttpResponse.json({ ok: true });
      }),
    );

    await expect(submitContact(submission, { endpoint: ENDPOINT, timeoutMs: 50 })).resolves.toEqual(
      { ok: false, reason: "timeout" },
    );
  });
});

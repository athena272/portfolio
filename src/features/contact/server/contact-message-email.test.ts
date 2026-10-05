import { buildContactMessageEmail, type ContactMessageEmailInput } from "./contact-message-email";

const input: ContactMessageEmailInput = {
  name: "Ana Souza",
  email: "ana@empresa.com",
  message: "Olá! Vi seu portfólio e gostaria de conversar sobre uma vaga.\nPodemos marcar?",
  locale: "en",
  receivedAt: new Date("2026-10-05T14:56:00Z"),
  siteUrl: "https://athena272portfolio.vercel.app",
};

describe("buildContactMessageEmail", () => {
  it("puts the visitor's name in the subject", () => {
    expect(buildContactMessageEmail(input).subject).toBe("Nova mensagem pelo portfólio: Ana Souza");
  });

  it("keeps the subject on a single line", () => {
    const { subject } = buildContactMessageEmail({ ...input, name: "Ana\r\nBcc: x@y.com" });
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("shows the visitor's details and the time in Brasília", () => {
    const { html, text } = buildContactMessageEmail(input);
    for (const content of [html, text]) {
      expect(content).toContain("ana@empresa.com");
      expect(content).toContain("Inglês");
      expect(content).toContain("05/10/2026 às 11:56");
    }
  });

  it("escapes everything the visitor typed", () => {
    const { html } = buildContactMessageEmail({
      ...input,
      name: "<script>alert(1)</script>",
      message: 'a & b "c" <img src=x>',
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("a &amp; b &quot;c&quot; &lt;img src=x&gt;");
  });

  it("keeps the full message, line breaks included, in the plain-text version", () => {
    const { text } = buildContactMessageEmail(input);
    expect(text).toContain(`Mensagem:\n${input.message}`);
  });

  it("offers a reply link to the visitor's address", () => {
    const { html } = buildContactMessageEmail(input);
    expect(html).toContain(
      'href="mailto:ana@empresa.com?subject=Re%3A%20Contato%20pelo%20portf%C3%B3lio"',
    );
  });

  it("builds a complete Portuguese HTML document with an inbox preview of the message", () => {
    const { html } = buildContactMessageEmail(input);
    expect(html.startsWith('<!DOCTYPE html><html lang="pt-BR">')).toBe(true);
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toContain(
      "Olá! Vi seu portfólio e gostaria de conversar sobre uma vaga. Podemos marcar?",
    );
  });

  it("truncates long messages in the inbox preview", () => {
    const { html } = buildContactMessageEmail({ ...input, message: "a".repeat(500) });
    expect(html).toContain(`${"a".repeat(139)}…`);
  });

  it("uses the site's palette and links back to it", () => {
    const { html, text } = buildContactMessageEmail(input);
    expect(html).toContain("#6d28d9");
    expect(html).toContain('href="https://athena272portfolio.vercel.app"');
    expect(text).toContain("athena272portfolio.vercel.app");
  });
});

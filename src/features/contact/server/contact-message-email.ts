import type { Locale } from "@/i18n/routing";

import { escapeHtml } from "./escape-html";

export interface ContactMessageEmailInput {
  name: string;
  email: string;
  message: string;
  /** Language of the page the visitor was on, a hint for which language to reply in. */
  locale: Locale;
  receivedAt: Date;
  siteUrl: string;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Light palette of the site (`src/app/globals.css`) in hex. Email clients ignore external CSS,
 * custom properties and oklch, so colors go inline and fixed.
 */
const BRAND = {
  ink: "#18181b",
  violet: "#6d28d9",
  violetOnInk: "#a78bfa",
  violetSoft: "#f5f3ff",
  violetText: "#5b21b6",
  page: "#f4f4f5",
  card: "#ffffff",
  border: "#e4e4e7",
  text: "#18181b",
  muted: "#52525b",
  onInk: "#d4d4d8",
} as const;

const FONT = "'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const LABEL_STYLE = `font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted}`;
const TIME_ZONE = "America/Sao_Paulo";
const PREHEADER_MAX_LENGTH = 140;
const REPLY_SUBJECT = "Re: Contato pelo portfólio";

const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "Inglês",
};

export function buildContactMessageEmail(input: ContactMessageEmailInput): EmailContent {
  const name = singleLine(input.name);
  const receivedAt = formatReceivedAt(input.receivedAt);
  const language = LOCALE_LABELS[input.locale];
  const siteHost = new URL(input.siteUrl).host;
  const replyHref = `mailto:${input.email}?subject=${encodeURIComponent(REPLY_SUBJECT)}`;

  // Email headers are single-line, so line breaks typed in the name become spaces.
  const subject = `Nova mensagem pelo portfólio: ${name}`;

  const html = layout({
    title: subject,
    preheader: truncate(singleLine(input.message), PREHEADER_MAX_LENGTH),
    body: [
      header(receivedAt),
      `<tr><td style="background:${BRAND.card};border-left:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};padding:28px 32px 8px">`,
      paragraph(
        `<strong style="color:${BRAND.text}">${escapeHtml(name)}</strong> escreveu pelo formulário de contato. Responder a este e-mail fala direto com a pessoa.`,
      ),
      details([
        ["Nome", escapeHtml(name)],
        [
          "E-mail",
          `<a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND.violetText};text-decoration:none">${escapeHtml(input.email)}</a>`,
        ],
        ["Idioma do site", language],
      ]),
      messageBlock(input.message),
      replyButton(replyHref),
      `</td></tr>`,
      footer(input.siteUrl, siteHost),
    ].join(""),
  });

  const text = [
    "Nova mensagem de contato",
    "",
    `${name} escreveu pelo formulário do portfólio.`,
    "",
    `Nome: ${name}`,
    `E-mail: ${input.email}`,
    `Idioma do site: ${language}`,
    `Recebida em: ${receivedAt}`,
    "",
    "Mensagem:",
    input.message,
    "",
    "---",
    `Enviado pelo formulário de contato de ${siteHost}. Responder a este e-mail fala direto com a pessoa.`,
  ].join("\n");

  return { subject, html, text };
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}…` : value;
}

function formatReceivedAt(date: Date): string {
  const day = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, dateStyle: "short" });
  const time = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, timeStyle: "short" });
  return `${day.format(date)} às ${time.format(date)}`;
}

/**
 * Table layout with inline styles: the only structure Gmail, Outlook and mobile clients render
 * consistently. The preheader is the summary shown in the inbox list.
 */
function layout({
  title,
  preheader,
  body,
}: {
  title: string;
  preheader: string;
  body: string;
}): string {
  return (
    `<!DOCTYPE html><html lang="pt-BR"><head>` +
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">` +
    `<title>${escapeHtml(title)}</title></head>` +
    `<body style="margin:0;padding:0;background:${BRAND.page};-webkit-text-size-adjust:100%">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.page}" style="background:${BRAND.page}">` +
    `<tr><td align="center" style="padding:32px 12px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${FONT};color:${BRAND.text}">` +
    body +
    `</table></td></tr></table></body></html>`
  );
}

function header(receivedAt: string): string {
  return (
    `<tr><td bgcolor="${BRAND.ink}" style="background:${BRAND.ink};border-radius:12px 12px 0 0;padding:24px 32px 22px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>` +
    `<td style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.onInk}">` +
    `<span style="color:${BRAND.violetOnInk}">&#9632;</span>&nbsp; Guilherme Rosário Alves</td>` +
    `<td align="right" style="font-family:${FONT};font-size:12px;color:${BRAND.onInk}">Portfólio</td>` +
    `</tr></table>` +
    `<h1 style="margin:18px 0 0;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:700;color:#ffffff">Nova mensagem de contato</h1>` +
    `<p style="margin:4px 0 0;font-family:${FONT};font-size:14px;color:${BRAND.onInk}">Recebida em ${escapeHtml(receivedAt)}</p>` +
    `</td></tr>` +
    `<tr><td bgcolor="${BRAND.violet}" style="background:${BRAND.violet};height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>`
  );
}

function paragraph(content: string): string {
  return `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BRAND.muted}">${content}</p>`;
}

function details(rows: Array<[label: string, htmlValue: string]>): string {
  const cells = rows
    .map(
      ([label, value], index) =>
        `<tr><td style="padding:12px 16px;${index > 0 ? `border-top:1px solid ${BRAND.border};` : ""}">` +
        `<div style="${LABEL_STYLE}">${label}</div>` +
        `<div style="margin-top:4px;font-size:15px;color:${BRAND.text};word-break:break-word">${value}</div>` +
        `</td></tr>`,
    )
    .join("");

  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ` +
    `style="margin:0 0 20px;background:${BRAND.page};border:1px solid ${BRAND.border};border-radius:10px;border-collapse:separate">` +
    cells +
    `</table>`
  );
}

function messageBlock(message: string): string {
  return (
    `<div style="${LABEL_STYLE}">Mensagem</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px"><tr>` +
    `<td style="background:${BRAND.violetSoft};border-left:4px solid ${BRAND.violet};border-radius:0 8px 8px 0;padding:14px 16px;` +
    `font-size:15px;line-height:1.6;color:${BRAND.text};white-space:pre-wrap;word-break:break-word">${escapeHtml(message)}</td>` +
    `</tr></table>`
  );
}

function replyButton(href: string): string {
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 24px"><tr>` +
    `<td bgcolor="${BRAND.violet}" style="background:${BRAND.violet};border-radius:8px">` +
    `<a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 32px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px">` +
    `Responder por e-mail</a>` +
    `</td></tr></table>`
  );
}

function footer(siteUrl: string, siteHost: string): string {
  return (
    `<tr><td style="background:${BRAND.card};border:1px solid ${BRAND.border};border-top:0;border-radius:0 0 12px 12px;padding:0 32px">` +
    `<p style="margin:0;padding:16px 0 20px;border-top:1px solid ${BRAND.border};font-size:12px;line-height:1.6;color:${BRAND.muted}">` +
    `Enviado pelo formulário de contato de ` +
    `<a href="${escapeHtml(siteUrl)}" style="color:${BRAND.violetText};text-decoration:none">${escapeHtml(siteHost)}</a>.</p>` +
    `</td></tr>`
  );
}

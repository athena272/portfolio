import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";

import { profile } from "@/content/profile";
import { routing } from "@/i18n/routing";
import { localize } from "@/lib/localize";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name}, Full Stack Developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const avatar = await readFile(join(process.cwd(), "public/images/avatar.png"));
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        gap: 64,
        padding: 80,
        background: "linear-gradient(135deg, #0e0e11 0%, #1e1533 60%, #3b1d5e 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> only */}
      <img
        src={avatarSrc}
        alt=""
        width={300}
        height={300}
        style={{ borderRadius: 9999, border: "8px solid rgba(255,255,255,0.15)" }}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 30, color: "#c4b5fd" }}>{localize(profile.role, locale)}</div>
        <div style={{ marginTop: 12, fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
          {profile.name}
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#d4d4d8", lineHeight: 1.4 }}>
          React · TypeScript · Node.js · Java · Python · PHP
        </div>
        <div style={{ marginTop: 40, fontSize: 24, color: "#a1a1aa" }}>
          {new URL(siteConfig.url).host}
        </div>
      </div>
    </div>,
    size,
  );
}

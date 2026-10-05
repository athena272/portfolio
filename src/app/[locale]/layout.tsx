import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/skip-link";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getLocalizedHomePath, localeTags, routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e11" },
  ],
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "metadata" });
  const languages = Object.fromEntries(
    routing.locales.map((code) => [localeTags[code], getLocalizedHomePath(code)]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s | ${siteConfig.name}` },
    description: t("description"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    alternates: {
      canonical: getLocalizedHomePath(locale),
      languages: { ...languages, "x-default": getLocalizedHomePath(routing.defaultLocale) },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: getLocalizedHomePath(locale),
      locale: localeTags[locale].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html
      lang={localeTags[locale]}
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MotionProvider>
              <SkipLink />
              <Header />
              <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

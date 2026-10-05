import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";

import en from "@messages/en.json";
import pt from "@messages/pt.json";
import type { Locale } from "@/i18n/routing";

const MESSAGES = { pt, en } as const;

type RenderWithIntlOptions = Omit<RenderOptions, "wrapper"> & { locale?: Locale };

/** Renders with the real translation files, so tests also catch missing or renamed keys. */
export function renderWithIntl(
  ui: ReactElement,
  { locale = "pt", ...options }: RenderWithIntlOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone="America/Sao_Paulo"
      >
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}

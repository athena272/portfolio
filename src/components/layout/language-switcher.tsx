"use client";

import { Languages } from "lucide-react";
import { useLinkStatus } from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link, usePathname } from "@/i18n/navigation";
import { getAlternateLocale, localeTags } from "@/i18n/routing";

type LanguageSwitcherProps = {
  /** Section to keep in view after switching, without the leading `#`. */
  hash?: string;
};

export function LanguageSwitcher({ hash }: LanguageSwitcherProps) {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const targetLocale = getAlternateLocale(locale);

  return (
    <Button asChild variant="ghost" size="sm" className="font-mono">
      <Link
        href={hash ? { pathname, hash } : pathname}
        locale={targetLocale}
        hrefLang={localeTags[targetLocale]}
        title={t("switchTo")}
      >
        <SwitchIndicator label={t("targetShort")} pendingLabel={t("switching")} />
        <span className="sr-only">{t("switchTo")}</span>
      </Link>
    </Button>
  );
}

type SwitchIndicatorProps = {
  label: string;
  pendingLabel: string;
};

/** Must render inside the `<Link>` so `useLinkStatus` can observe its navigation. */
function SwitchIndicator({ label, pendingLabel }: SwitchIndicatorProps) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? <Spinner /> : <Languages aria-hidden="true" />}
      <span aria-hidden="true">{label}</span>
      <span role="status" className="sr-only">
        {pending ? pendingLabel : ""}
      </span>
    </>
  );
}

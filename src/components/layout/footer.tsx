import { useTranslations } from "next-intl";

import { SocialLinks } from "@/components/shared/social-links";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="text-center text-sm text-muted-foreground sm:text-left">
          <p>
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <p className="mt-1">{t("builtWith")}</p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}

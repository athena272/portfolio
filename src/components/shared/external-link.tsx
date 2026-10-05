import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "target" | "rel"> & {
  href: string;
};

/** Anchor that opens in a new tab safely and tells screen reader users about it. */
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  const t = useTranslations("common");

  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {t("opensInNewTab")}</span>
    </a>
  );
}

import type { ComponentProps } from "react";

type Href = string | { pathname: string; hash?: string };

type MockLinkProps = Omit<ComponentProps<"a">, "href"> & { href: Href; locale?: string };

/**
 * Stand-in for `@/i18n/navigation`, which depends on the Next.js router.
 * Exposes the target locale as `data-locale` so tests can assert on it.
 */
export function MockLink({ href, locale, children, ...props }: MockLinkProps) {
  const url =
    typeof href === "string" ? href : `${href.pathname}${href.hash ? `#${href.hash}` : ""}`;
  return (
    <a href={url} data-locale={locale} {...props}>
      {children}
    </a>
  );
}

export const mockNavigation = {
  Link: MockLink,
  usePathname: () => "/",
};

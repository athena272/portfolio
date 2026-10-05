"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";
import { getLocalizedHomePath } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import {
  HOME_SECTION_ID,
  OBSERVED_SECTION_IDS,
  SECTION_IDS,
  toNavSection,
  type SectionId,
} from "@/lib/sections";
import { siteConfig } from "@/lib/site-config";

import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

const MOBILE_MENU_ID = "mobile-navigation";

/**
 * Anchors include the localized home path so they also work from other pages (such as the 404).
 * On the home page itself, the browser treats them as same-page jumps.
 */
function useSectionHref() {
  const homePath = getLocalizedHomePath(useLocale());
  return (id: string) => `${homePath}#${id}`;
}

export function Header() {
  const t = useTranslations("nav");
  const sectionHref = useSectionHref();
  const activeSection = toNavSection(useActiveSection(OBSERVED_SECTION_IDS));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href={sectionHref(HOME_SECTION_ID)}
          className="rounded-md font-mono text-lg font-semibold tracking-tight focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {siteConfig.initials}
          <span className="text-primary">.</span>
          <span className="sr-only">{t("home")}</span>
        </a>

        <nav aria-label={t("label")} className="hidden md:block">
          <NavLinks activeSection={activeSection} className="flex items-center gap-1" />
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher hash={activeSection ?? undefined} />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id={MOBILE_MENU_ID} aria-label={t("label")} className="border-t md:hidden">
          <NavLinks
            activeSection={activeSection}
            onNavigate={closeMenu}
            className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6"
          />
        </nav>
      )}
    </header>
  );
}

type NavLinksProps = {
  activeSection: string | null;
  className?: string;
  onNavigate?: () => void;
};

function NavLinks({ activeSection, className, onNavigate }: NavLinksProps) {
  const t = useTranslations("nav");
  const sectionHref = useSectionHref();

  return (
    <ul className={className}>
      {SECTION_IDS.map((id: SectionId) => {
        const isActive = activeSection === id;
        return (
          <li key={id}>
            <a
              href={sectionHref(id)}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                isActive && "bg-accent text-accent-foreground",
              )}
            >
              {t(id)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

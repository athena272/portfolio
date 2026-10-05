"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  // The resolved theme is only known on the client; keep the slot stable until then.
  if (!isMounted) {
    return <Button variant="ghost" size="icon" aria-label={t("toggle")} disabled />;
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("activateLight") : t("activateDark");

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}

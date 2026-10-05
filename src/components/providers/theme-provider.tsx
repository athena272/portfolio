"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * next-themes renders its anti-flash script on every render. Only the server copy runs (before
 * hydration); a client-created copy never runs, and React reports it unless it is a data block.
 */
const CLIENT_SCRIPT_TYPE = "text/plain";

export function ThemeProvider({ scriptProps, ...props }: ThemeProviderProps) {
  const isServer = typeof window === "undefined";

  return (
    <NextThemesProvider
      {...props}
      scriptProps={isServer ? scriptProps : { ...scriptProps, type: CLIENT_SCRIPT_TYPE }}
    />
  );
}

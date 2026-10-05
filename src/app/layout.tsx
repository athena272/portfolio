import type { ReactNode } from "react";

import "./globals.css";

/** The `<html>` element lives in `[locale]/layout.tsx` so its `lang` follows the active locale. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

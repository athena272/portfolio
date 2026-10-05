import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

const fieldBaseClassName =
  "w-full min-w-0 rounded-lg border border-input bg-background px-3 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm";

function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input type={type} className={cn(fieldBaseClassName, "h-10 py-2", className)} {...props} />
  );
}

export { fieldBaseClassName, Input };

import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { fieldBaseClassName } from "./input";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBaseClassName, "min-h-32 py-2", className)} {...props} />;
}

export { Textarea };

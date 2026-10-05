import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label className={cn("text-sm leading-none font-medium select-none", className)} {...props} />
  );
}

export { Label };

import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <LoaderCircle aria-hidden="true" className={cn("size-4 animate-spin", className)} {...props} />
  );
}

export { Spinner };

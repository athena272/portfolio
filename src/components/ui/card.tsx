import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />;
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("leading-tight font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        variant === "primary" &&
          "bg-accent text-white shadow-sm hover:bg-accent-hover",
        variant === "secondary" && "bg-ink text-white hover:bg-ink/90",
        variant === "subtle" &&
          "bg-primary-100 text-primary hover:bg-primary-100/70",
        variant === "ghost" &&
          "border border-ink/15 bg-white text-ink hover:border-ink/30",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

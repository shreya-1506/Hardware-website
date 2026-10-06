import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "whatsapp"
  | "outline"
  | "outline-light"
  | "ghost"
  | "dark"
  | "danger";

type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-55 active:translate-y-px whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-safety-500 text-white shadow-[0_10px_24px_-12px_rgba(249,112,8,0.9)] hover:bg-safety-600 hover:shadow-[0_14px_30px_-12px_rgba(249,112,8,0.95)]",
  whatsapp:
    "bg-[#1FA855] text-white shadow-[0_10px_24px_-12px_rgba(31,168,85,0.9)] hover:bg-[#178c46]",
  outline:
    "border border-steel-300 bg-white text-navy-800 hover:border-navy-400 hover:bg-steel-50 hover:text-navy-900",
  "outline-light":
    "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10",
  ghost: "text-navy-700 hover:bg-steel-100 hover:text-navy-900",
  dark: "bg-navy-800 text-white hover:bg-navy-700",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = CommonProps & ComponentProps<"button">;

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}

type ExternalButtonProps = CommonProps & ComponentProps<"a">;

/** For `wa.me`, `tel:` and map links that must leave the SPA router. */
export function ButtonAnchor({
  variant,
  size,
  className,
  children,
  ...rest
}: ExternalButtonProps) {
  return (
    <a className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </a>
  );
}

"use client";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "gold" | "ghost" | "danger";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const styles: Record<Variant, string> = {
  primary: "bg-gradient-to-br from-maroon to-maroon-dark text-white shadow-md hover:shadow-lg",
  gold: "bg-gradient-to-br from-gold-light to-gold text-[#3A2A10] shadow-gold hover:shadow-lg",
  ghost: "bg-transparent border border-line text-ink hover:bg-cream",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function Button({ variant = "primary", loading, children, className = "", disabled, ...rest }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-5 py-2.5 transition-all active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading && <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
      {children}
    </button>
  );
}

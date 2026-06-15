import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperId?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, wrapperId, className = "", ...rest }, ref) => (
    <div id={wrapperId}>
      {label && <label className="block text-[12.5px] font-semibold mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-3 py-2.5 rounded-xl border-[1.5px] bg-cream text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/25 ${error ? "border-red-400" : "border-line"} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

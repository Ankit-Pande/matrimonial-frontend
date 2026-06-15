import { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[] | string[];
  placeholder?: string;
  error?: string;
  wrapperId?: string;
}

// Dropdown. options me string ya {value,label} dono chalte hain.
// error diya ho to niche laal text me dikhta hai.
export function Select({
  label,
  options,
  placeholder,
  error,
  wrapperId,
  className = "",
  ...rest
}: SelectProps) {
  // string list ko {value,label} me badal do.
  const list: Option[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <div id={wrapperId}>
      {label && (
        <label className="block text-[12.5px] font-semibold mb-1.5">{label}</label>
      )}
      <select
        className={`w-full px-3 py-2.5 rounded-xl border-[1.5px] bg-cream text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/25 ${
          error ? "border-red-400" : "border-line"
        } ${className}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {list.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

import { forwardRef, useState } from "react";

interface CustomInputProps {
  label: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { label, type, value, onChange, name, id, className = "", ...rest },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId =
      id || name || `input-${Math.random().toString(36).slice(2, 11)}`;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const shouldFloatLabel = isFocused || value.length > 0;
    return (
      <div className="relative bg-black/15">
        <input
          ref={ref}
          type={type}
          value={value}
          name={name}
          id={inputId}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          className={`peer w-full border-2 rounded-2xl mx-3 my-3 ${className}`}
          {...rest}
        />

        <label
          htmlFor={inputId}
          className={`absolute left-4 text-red-400 ${
            shouldFloatLabel
              ? "top-2 text-[11px] font-semibold text-font"
              : "top-1 text-sm"
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);

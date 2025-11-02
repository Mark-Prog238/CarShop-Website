import { forwardRef, useState } from "react";
interface CustomInputProps {
  label: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "number";
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
  icon?: string;
  iconStyle?: string;
  iconEvent?: () => void;
}
export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      type,
      value,
      onChange,
      name,
      id,
      className = "",
      icon,
      iconStyle,
      iconEvent,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId =
      id || name || `input-${Math.random().toString(36).slice(2, 11)}`;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const shouldFloatLabel = isFocused || value.length > 0;
    return (
      <div className="relative ">
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
          className={`peer rounded-2xl px-2 pt-3 pb-1.5 text-sm placeholder-transparent
            transition-all duration-200
            bg-primaryColor border-2 border-black/70 shadow-2xl shadow-secondaryColor/30
            focus:outline-none
            ${className}`}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={`absolute left-4 text-gray-400/90 flex items-center justify-center
            transition-all duration-200
            ${shouldFloatLabel ? "top-1 text-xs" : "top-3 text-sm"}`}
        >
          {label}
        </label>
        {icon && (
          <img
            src={icon}
            onClick={iconEvent}
            className={`absolute flex items-center justify-center right-2 top-3 ${iconStyle} size-5 cursor-pointer`}
          />
        )}
      </div>
    );
  }
);

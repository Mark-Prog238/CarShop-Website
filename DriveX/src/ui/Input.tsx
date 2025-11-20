import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className = "", id, ...rest }, ref) => {
    const inputId = id || `in-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block pb-1 text-sm text-white/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg bg-buttonBg/70 border border-black/20 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-primaryColor ${className}`}
          {...rest}
        />
        {hint && <p className="pt-1 text-xs text-white/60">{hint}</p>}
      </div>
    );
  }
);



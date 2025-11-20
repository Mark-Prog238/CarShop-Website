import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className = "", id, children, ...rest }, ref) => {
    const selectId = id || `sel-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block pb-1 text-sm text-white/80"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg bg-primaryColor/40 px-3 py-2 outline-none focus:ring-2 focus:ring-primaryColor ${className}`}
          {...rest}
        >
          {children}
        </select>
      </div>
    );
  }
);

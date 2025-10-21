import { forwardRef, useState } from "react";

interface CustomButtonProps {
  label?: string;
  type?: "submit" | "reset";
  value?: string;
  onClick?: (value: string) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ label, type, value, onClick, id, className = "", ...rest }, ref) => {
    return (
      <div>
        <button
          value={value}
          type={type}
          id={id}
          className={`bg-secondaryColor rounded-lg
            shadow-2xl shadow-secondaryColor/30
            focus:outline-none 
            ${className}`}
          {...rest}
        >
          {label}
        </button>
      </div>
    );
  }
);

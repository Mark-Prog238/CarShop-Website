import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type ButtonProps = Omit<HTMLMotionProps<"button">, "ref"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", children, ...rest },
    ref
  ) => {
    const base =
      "rounded-xl font-semibold transition-all duration-200 focus:outline-none";
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-sm",
      lg: "px-6 py-3 text-base",
    }[size];
    const variants = {
      primary:
        "bg-primaryColor text-white hover:bg-primaryColor-light active:bg-primaryColor-dark shadow-md",
      secondary:
        "border border-primaryColor text-primaryColor hover:bg-primaryColor/10",
      ghost: "text-white/80 hover:text-white hover:bg-white/10",
    }[variant];

    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={`${base} ${sizes} ${variants} ${className}`}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

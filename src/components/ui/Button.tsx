import React from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
  kind?: "default" | "primary";
  size?: "sm" | "md" | "lg";
  circular?: boolean;
  icon?: LucideIcon;
}

const Button: React.FC<ButtonProps> = ({
  destructive = false,
  kind = "default",
  size = "md",
  circular = false,
  icon: Icon,
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const kindStyles = {
    default:
      "hover:bg-neutral-950/5 dark:hover:bg-neutral-50/10 text-[var(--color-fg-muted)] hover:text-[var(--color-fg-primary)]",
    primary:
      "bg-[var(--color-bg-accent)] text-white hover:bg-[var(--color-bg-accent-hover)] shadow-lg",
  };

  const destructiveStyles =
    "hover:text-red-600 hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:bg-red-900/30";

  const sizeStyles = {
    sm: children ? "px-4 h-9" : "size-9",
    md: children ? "px-4 h-12" : "size-12",
    lg: circular ? "px-6 h-20" : "size-20",
  };

  const shapeStyles = circular ? "rounded-full" : "rounded-lg";

  const defaultIconSize = size === "lg" ? 32 : size === "md" ? 24 : 20;

  return (
    <button
      className={`${baseStyles} ${kindStyles[kind]} ${
        sizeStyles[size]
      } ${shapeStyles} ${destructive && destructiveStyles} ${className}`}
      {...props}
    >
      {Icon && (
        <Icon
          size={defaultIconSize}
          className={`${children ? "mr-2" : ""} ${
            kind === "primary" && !children ? "fill-current" : ""
          }`}
        />
      )}
      {children}
    </button>
  );
};

export default Button;

import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="block text-sm font-semibold">{label}</label>}
      <input
        className={`w-full text-lg font-semibold bg-[var(--color-bg-layer)] p-2 rounded-lg outline-none border border-[var(--color-border-default)] transition-all focus:border-[var(--color-bg-accent)] placeholder:text-[var(--color-fg-muted)] placeholder:font-normal ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextInput;

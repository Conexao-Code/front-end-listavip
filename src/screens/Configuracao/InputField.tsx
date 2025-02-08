import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InputFieldComponent: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e1ff01] text-white"
      disabled={disabled}
    />
  </div>
);

export const InputField = React.memo(InputFieldComponent);

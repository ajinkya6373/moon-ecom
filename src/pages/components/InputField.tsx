import React, { useState } from "react";
interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  required?: boolean;
  showButton?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  name,
  required,
  showButton,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mb-6 relative">
      <label htmlFor={id} className="block text-base font-normal">
        {label}
      </label>
      <input
        type={showPassword ? "text" : type}
        id={id}
        name={name}
        placeholder={`Enter ${name}`}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black"
        required={required}
      />
      {showButton?.toString() === "true" && (
        <button className="absolute right-4 top-9 underline" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
};

export default InputField;

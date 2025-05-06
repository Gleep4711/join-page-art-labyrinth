import { useState } from "react";

export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id: string;
  label: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ disabled, defaultChecked, id, label, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      if (onChange) {
        onChange(newChecked);
      }
    }
  };

  return (
    <div className="w-full flex gap-4 items-center">
      <input
        id={id}
        type="checkbox"
        className="relative appearance-none shrink-0 w-4 h-4 rounded my-auto bg-[#BAC1A0] border border-matchaGreen"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      {isChecked && (
        <svg
          className="absolute w-4 h-4 pointer-events-none stroke-white my-2 outline-none bg-matchaGreen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" className="text-white"></polyline>
        </svg>
      )}
      <label htmlFor={id} className="cursor-pointer w-full">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
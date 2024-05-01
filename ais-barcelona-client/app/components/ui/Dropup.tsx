import React, { useState, useRef, useEffect } from 'react';

type OptionType = {
  value: string;
  label: string;
};

interface DropdownProps {
  options: OptionType[];
  selectedOption: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const Dropup: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mt-1" ref={dropdownRef}>
      <button
        className={`w-full rounded-md border-2 border-black px-2 py-1 text-left shadow-sm focus:outline-none  dark:border-white ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {options.find((option) => option.value === selectedOption)?.label || ''}
        <span className="float-right ml-1">&#9650;</span>
      </button>
      {isOpen && (
        <ul className="absolute right-0 top-[-100%] z-10 w-full translate-y-[-50%] overflow-auto rounded-md border-2 border-black bg-white shadow-lg dark:border-white dark:bg-black">
          {options.map((option) => (
            <li
              key={option.value}
              className="cursor-pointer px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 "
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropup;

import { useState, useRef, useEffect } from 'react';

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

export default function Dropup({
  options,
  selectedOption,
  onChange,
  disabled,
}: DropdownProps) {
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
    <div className="relative" ref={dropdownRef}>
      <button
        className={`w-full rounded-md border-2 border-black px-2 py-1 text-left shadow-sm focus:outline-none dark:border-white ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {options.find((option) => option.value === selectedOption)?.label || ''}
        <span className="float-right ml-2">{isOpen ? '⏶' : '⏵'} </span>
      </button>
      {isOpen && (
        <ul className="absolute bottom-full z-10 mb-0.5 w-full overflow-auto rounded-md border-2 border-black bg-white text-left shadow-lg dark:border-white dark:bg-black">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`cursor-pointer px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 ${index < options.length - 1 ? 'border-b-2' : ''}`}
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
}

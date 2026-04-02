import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';

export function Dropdown({ value, onChange, options, icon: Icon, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { theme } = useFinance();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === 'string' ? opt === value : opt.value === value
  );
  
  const selectedLabel = typeof selectedOption === 'string' ? selectedOption : selectedOption?.label || value;

  return (
    <div className={cn("relative z-20", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between space-x-3 px-5 py-2.5 text-base font-medium border focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 rounded-xl hover:shadow-md hover:scale-[1.02]",
          theme === 'dark' ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
          isOpen ? "ring-2 ring-primary border-primary scale-[1.02]" : ""
        )}
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className={cn("h-5 w-5", theme === 'dark' ? "text-gray-400" : "text-gray-500")} />}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0", theme === 'dark' ? "text-gray-400" : "text-gray-500")} />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute top-full left-0 mt-2 w-[110%] min-w-max max-h-60 overflow-y-auto rounded-xl border shadow-xl animate-fade-in origin-top z-50",
            theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          )}
        >
          <ul className="py-1">
            {options.map((opt, idx) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const isSelected = optValue === value;
              
              return (
                <li key={`${optValue}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(optValue);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-all duration-200 hover:translate-x-1 hover:scale-[1.01]",
                      isSelected 
                        ? (theme === 'dark' ? "bg-primary/20 text-primary font-semibold" : "bg-primary/10 text-primary font-semibold") 
                        : (theme === 'dark' ? "text-gray-300 hover:bg-primary/20 hover:text-primary hover:font-bold" : "text-gray-700 hover:bg-primary/10 hover:text-primary hover:font-bold")
                    )}
                  >
                    {optLabel}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

export const Select = React.forwardRef(({
  className,
  label,
  options = [],
  placeholder = 'Select option...',
  error,
  disabled,
  required,
  value,
  onChange,
  name,
  onBlur,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectRef = useRef(null);

  // Combine forwarded ref and local ref
  const setRef = (node) => {
    selectRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  // Find active selected label
  const activeValue = value !== undefined ? value : (selectRef.current?.value || '');
  const selectedOption = options.find(opt => String(opt.value) === String(activeValue));
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || 'Select option...');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleOptionClick = (opt) => {
    if (disabled) return;

    // 1. Update native select value for react-hook-form integration
    if (selectRef.current) {
      selectRef.current.value = opt.value;
      // Trigger native change event so handlers like react-hook-form register receive the updates
      const event = new Event('change', { bubbles: true });
      selectRef.current.dispatchEvent(event);
    }

    // 2. Call custom onChange handler if passed directly
    if (onChange) {
      onChange({
        target: {
          name,
          value: opt.value
        }
      });
    }

    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden Native Select for HTML Form compatibility */}
      <select
        ref={setRef}
        name={name}
        value={activeValue}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className="sr-only"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Designed Trigger Button */}
      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full bg-slate-900/60 border rounded-lg text-left text-sm text-slate-200 py-2.5 px-3.5 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all cursor-pointer flex items-center justify-between gap-2',
            error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-slate-800 focus:border-blue-500/50',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-950/20',
            className
          )}
        >
          <span className={cn('truncate', !selectedOption && 'text-slate-500')}>
            {displayLabel}
          </span>
          <span className="text-slate-500 shrink-0">
            <svg
              className={cn('w-4 h-4 fill-current transition-transform duration-200', isOpen && 'rotate-180')}
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {/* Custom Designed Dropdown Menu Option List Overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800/40 animate-fade-in scrollbar-none">
            {placeholder && (
              <button
                type="button"
                onClick={() => handleOptionClick({ value: '', label: placeholder })}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-500 hover:bg-slate-900/60 transition-colors"
              >
                {placeholder}
              </button>
            )}
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(activeValue);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleOptionClick(opt)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between',
                    isSelected
                      ? 'bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-350 hover:bg-blue-600/10 hover:text-blue-400 font-medium'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500/90 font-medium mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

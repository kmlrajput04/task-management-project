import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  placeholder,
  helperText,
  error,
  disabled,
  required,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-400">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {LeftIcon && (
          <span className="absolute left-3 pointer-events-none text-slate-500">
            <LeftIcon className="w-4 h-4 shrink-0" />
          </span>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full bg-slate-900/60 border rounded-lg text-sm text-slate-200 placeholder-slate-500 py-2 focus:outline-none focus:ring-1 transition-all',
            LeftIcon ? 'pl-9' : 'pl-3.5',
            RightIcon ? 'pr-9' : 'pr-3.5',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
              : 'border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/30',
            disabled && 'opacity-50 cursor-not-allowed bg-slate-950/20',
            className
          )}
          {...props}
        />
        {RightIcon && (
          <span className="absolute right-3 text-slate-500">
            <RightIcon className="w-4 h-4 shrink-0" />
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500/90 font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

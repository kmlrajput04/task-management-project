import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(({
  className,
  label,
  placeholder,
  rows = 4,
  helperText,
  error,
  disabled,
  required,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-400">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'w-full bg-slate-900/60 border rounded-lg text-sm text-slate-200 placeholder-slate-500 px-3.5 py-2 focus:outline-none focus:ring-1 transition-all resize-y',
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
            : 'border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/30',
          disabled && 'opacity-50 cursor-not-allowed bg-slate-950/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500/90 font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;

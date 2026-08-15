import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border border-transparent shadow-sm',
    secondary: 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80',
    outline: 'bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-100',
    ghost: 'bg-transparent hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-transparent',
    danger: 'bg-red-600 hover:bg-red-500 text-white border border-transparent shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <Spinner size="sm" className="mr-2" />
      )}
      {!loading && LeftIcon && (
        <LeftIcon className="w-4 h-4 mr-2 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && RightIcon && (
        <RightIcon className="w-4 h-4 ml-2 shrink-0" />
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;

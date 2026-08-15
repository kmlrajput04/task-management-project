import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export const Avatar = ({
  className,
  src,
  name = '',
  size = 'md',
  fallback: CustomFallback,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-xl font-bold'
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative shrink-0 rounded-full bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center text-slate-300 select-none',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : CustomFallback ? (
        <CustomFallback />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;

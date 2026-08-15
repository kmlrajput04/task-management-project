import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  className,
  title,
  description,
  header: Header,
  footer: Footer,
  padding = 'md',
  children,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={cn(
        'bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm',
        className
      )}
      {...props}
    >
      {/* Header */}
      {(title || description || Header) && (
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          {Header ? (
            Header
          ) : (
            <div className="space-y-1">
              {title && <h3 className="text-sm font-bold text-slate-200">{title}</h3>}
              {description && <p className="text-xs text-slate-500">{description}</p>}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className={cn(paddings[padding], 'text-sm text-slate-300')}>
        {children}
      </div>

      {/* Footer */}
      {Footer && (
        <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-800/80 flex items-center justify-end">
          {Footer}
        </div>
      )}
    </div>
  );
};

export default Card;

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchInput = ({
  className,
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  ...props
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-xs', className)}>
      <span className="absolute left-3 pointer-events-none text-slate-500">
        <Search className="w-4 h-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-slate-900/60 border border-slate-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none rounded-lg text-sm text-slate-200 placeholder-slate-500 transition-all"
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 p-0.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

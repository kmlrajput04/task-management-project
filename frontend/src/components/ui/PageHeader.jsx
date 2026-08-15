import React from 'react';
import { cn } from '../../utils/cn';

export const PageHeader = ({
  className,
  title,
  description,
  actions: Actions,
  breadcrumbs = []
}) => {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800/80 mb-6 gap-4', className)}>
      <div className="space-y-1.5">
        {/* Breadcrumbs placeholder */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-600">/</span>}
                <span>{crumb}</span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-tight">{title}</h2>
        {description && <p className="text-xs md:text-sm text-slate-400 max-w-2xl">{description}</p>}
      </div>
      {Actions && (
        <div className="flex items-center gap-3 shrink-0">
          {Actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

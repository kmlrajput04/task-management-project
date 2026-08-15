import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

export const Table = ({
  className,
  headers = [],
  rows = [],
  loading = false,
  emptyState: EmptyStateView,
  striped = false,
  hover = true,
  onRowClick
}) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-950/40 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center">
                <div className="flex justify-center items-center gap-2">
                  <Spinner size="md" className="text-blue-500" />
                  <span className="text-slate-400">Loading records...</span>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-500">
                {EmptyStateView ? EmptyStateView : 'No records found.'}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row, rowIdx)}
                className={cn(
                  'transition-colors',
                  striped && rowIdx % 2 === 1 ? 'bg-slate-950/20' : 'bg-transparent',
                  hover && 'hover:bg-slate-800/40',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-6 py-4 text-slate-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

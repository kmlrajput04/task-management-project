import React from 'react';

export const PageLoader = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-400">Loading details...</p>
    </div>
  );
};

export default PageLoader;

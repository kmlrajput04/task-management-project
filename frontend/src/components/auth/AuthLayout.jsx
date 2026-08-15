import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TaskHub Pro
          </span>
          <p className="text-xs text-slate-500 font-medium">Internal Management & Analytics Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

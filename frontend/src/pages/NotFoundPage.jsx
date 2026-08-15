import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h2 className="text-6xl font-extrabold text-blue-500">404</h2>
      <p className="text-xl text-slate-300 font-semibold">Page Not Found</p>
      <p className="text-slate-400 max-w-sm">The page you are looking for does not exist or has been moved.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;

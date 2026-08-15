import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as LucideIcons from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { toggleSidebar } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import { toast } from 'sonner';

export const Sidebar = () => {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const dispatch = useDispatch();
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`bg-slate-950/80 border-r border-slate-800 flex flex-col h-screen shrink-0 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
        {sidebarOpen && (
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TaskHub Pro
          </span>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <LucideIcons.Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          // Hide Users and External Users page for MEMBER roles
          if ((item.label === 'Users' || item.label === 'External Users') && user?.role === 'MEMBER') {
            return null;
          }

          const IconComponent = LucideIcons[item.iconName] || LucideIcons.HelpCircle;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition-colors mt-8"
        >
          <LucideIcons.LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500 text-center">
        {sidebarOpen ? 'TaskHub v1.0' : 'v1.0'}
      </div>
    </aside>
  );
};

export default Sidebar;

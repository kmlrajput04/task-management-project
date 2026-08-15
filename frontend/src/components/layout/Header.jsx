import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon, LogOut, CheckCircle, MessageSquare } from 'lucide-react';
import { toggleTheme } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import { Avatar, Badge } from '../ui';
import { toast } from 'sonner';
import { formatRelativeDate } from '../../utils/date';
import {
  fetchNotificationsAsync,
  markReadAsync,
  markAllReadAsync
} from '../../store/slices/notificationsSlice';

export const Header = () => {
  const theme = useSelector((state) => state.ui.theme);
  const notifications = useSelector((state) => state.notifications.items) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSignOut = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Dispatch fetch notifications every 10 seconds for real-time synchronization
  useEffect(() => {
    if (!user) return;
    dispatch(fetchNotificationsAsync());

    const timer = setInterval(() => {
      dispatch(fetchNotificationsAsync());
    }, 10000);

    return () => clearInterval(timer);
  }, [dispatch, user]);

  const handleMarkAllRead = () => {
    dispatch(markAllReadAsync());
  };

  const handleMarkRead = (id) => {
    dispatch(markReadAsync(id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-slate-950/40 border-b border-slate-800/80 px-6 flex items-center justify-between relative z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Placeholder spacer */}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl p-4 space-y-3 animate-fade-in no-invert">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-200">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-none divide-y divide-slate-800/40">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && handleMarkRead(n.id)}
                      className={`pt-2 first:pt-0 flex gap-2.5 items-start cursor-pointer group transition-colors rounded p-1.5 -mx-1.5 ${
                        n.read ? 'opacity-60 hover:bg-slate-800/30' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {n.type === 'TASK_ASSIGNED' ? (
                        <User className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                      ) : n.type === 'COMMENT_ADDED' ? (
                        <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      )}
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className={`text-xs leading-normal group-hover:text-slate-100 ${
                          n.read ? 'text-slate-400' : 'text-slate-200 font-medium'
                        }`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {formatRelativeDate(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5"></span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:bg-slate-800/40 transition-colors focus:outline-none"
          >
            {user ? (
              <Avatar
                size="sm"
                src={user.avatar}
                name={user.name}
                className="border border-slate-700/80 hover:border-slate-500/80 transition-colors no-invert"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <User className="w-4 h-4" />
              </div>
            )}
          </button>

          {profileOpen && user && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl p-4 space-y-4 animate-fade-in no-invert">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                <div className="pt-1.5">
                  <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'MANAGER' ? 'warning' : 'info'}>
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from 'react';
import { Bell, PlusCircle, Menu, BellOff, Sun, Moon } from 'lucide-react';
import { ActiveView } from '../../types';
import { authService } from '../../services/authService';
import { userDataService } from '../../services/userDataService';
import { apiGet, apiPost } from '../../services/apiClient';
import { UserAvatar } from './UserAvatar';

interface HeaderProps {
  onNavigate: (view: ActiveView) => void;
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, title, subtitle, onOpenMobileMenu, isDarkMode, onToggleDarkMode }) => {
  const user = authService.getCurrentUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() =>
    userDataService.getUserNotifications(user.id, user.email)
  );

  const refreshNotifications = async () => {
    try {
      const result = await apiGet<{ items: any[] }>('/api/notifications');
      if (Array.isArray(result.items)) {
        setNotifications(result.items);
        return;
      }
    } catch {
      // Keep the local fallback for offline/demo use.
    }
    setNotifications(userDataService.getUserNotifications(user.id, user.email));
  };

  useEffect(() => {
    refreshNotifications();
    const timer = window.setInterval(refreshNotifications, 4000);
    return () => window.clearInterval(timer);
  }, [user.id, user.email]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = async () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    userDataService.setUserNotifications(user.id, updated);
    try { await apiPost('/api/notifications/read-all'); } catch { /* offline fallback */ }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile menu / optional page title. The global search bar has been removed. */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 truncate -mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Report Button */}
        <button
          id="header-report-btn"
          onClick={() => onNavigate('report-scam')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Report a Scam</span>
          <span className="sm:hidden">Report</span>
        </button>

        {/* Global theme toggle */}
        <button
          id="header-theme-toggle"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-950" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white">Threat Alerts</span>
                  {notifications.length > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {notifications.length}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center space-y-1 text-slate-500 dark:text-slate-400">
                  <BellOff className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">No notifications</p>
                  <p className="text-[11px] text-slate-400">You're all caught up on threats and alerts.</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-lg transition-colors ${
                        n.unread ? 'bg-slate-50 dark:bg-slate-800/60 font-medium' : 'text-slate-500'
                      }`}
                    >
                      <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User avatar / profile trigger */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="My Profile"
        >
          <UserAvatar avatarUrl={user.avatarUrl} size="sm" />
        </button>
      </div>
    </header>
  );
};

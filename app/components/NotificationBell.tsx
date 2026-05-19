'use client';

import { useEffect, useState } from 'react';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  CryptoBidXNotification,
} from '@/app/lib/notifications';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<CryptoBidXNotification[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    const all = getNotifications();
    setNotifications(all);
    setUnreadCount(getUnreadNotificationCount());
  };

  useEffect(() => {
    loadNotifications();

    const handler = () => loadNotifications();

    window.addEventListener('cryptobidx_notifications_updated', handler);

    return () => {
      window.removeEventListener('cryptobidx_notifications_updated', handler);
    };
  }, []);

  const handleToggle = () => {
    setOpen(!open);

    if (!open) {
      markAllNotificationsAsRead();
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={handleToggle}
        className="relative text-white hover:opacity-80 transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-gray-700 rounded-xl shadow-xl z-50">
          <div className="p-3 border-b border-gray-700 font-semibold text-sm">
            Notifications
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 border-b border-gray-800 text-sm hover:bg-gray-800 transition"
                >
                  <div className="font-medium">{n.title}</div>
                  <div className="text-gray-400 text-xs mt-1">{n.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

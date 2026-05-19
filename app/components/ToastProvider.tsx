'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/app/lib/notifications';

type Toast = {
  id: string;
  title: string;
  message: string;
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = () => {
      const latest = getNotifications()[0];

      if (!latest) return;

      const newToast: Toast = {
        id: latest.id,
        title: latest.title,
        message: latest.message,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 3));

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('cryptobidx_notifications_updated', handler);

    return () => {
      window.removeEventListener('cryptobidx_notifications_updated', handler);
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[100] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-80 rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-xl animate-slide-in"
        >
          <p className="font-semibold">{toast.title}</p>
          <p className="text-sm text-slate-400 mt-1">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

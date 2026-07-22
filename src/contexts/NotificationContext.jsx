import { useCallback, useEffect, useMemo, useState } from 'react';
import { database } from '../services/database';
import { NotificationContext } from './notification-context';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => database.list('notifications'));

  const refresh = useCallback(() => {
    setNotifications(database.list('notifications'));
  }, []);

  useEffect(() => {
    const handleDatabaseChange = (event) => {
      if (!event.detail?.collection || event.detail.collection === 'notifications') refresh();
    };
    const handleStorage = (event) => {
      if (event.key === database.key) refresh();
    };
    window.addEventListener(database.changeEvent, handleDatabaseChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(database.changeEvent, handleDatabaseChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const addNotification = useCallback((values) => {
    const notification = database.create('notifications', {
      ...values,
      read: false,
      type: values.type ?? 'system',
    }, 'notification');
    return notification;
  }, []);

  const markRead = useCallback((id) => {
    database.update('notifications', id, { read: true });
  }, []);

  const markAllRead = useCallback(() => {
    database.list('notifications').forEach((notification) => {
      if (!notification.read) database.update('notifications', notification.id, { read: true });
    });
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read).length,
    addNotification,
    markRead,
    markAllRead,
    refresh,
  }), [addNotification, markAllRead, markRead, notifications, refresh]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

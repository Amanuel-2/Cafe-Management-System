import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';

export function NotificationPanel() {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="icon" Icon={Bell} aria-label="Notifications" className="relative">
          {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" /> : null}
        </Button>
      }
    >
      <div className="w-80 p-2">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-sm font-semibold text-stone-950 dark:text-stone-50">Notifications</p>
          <Button variant="ghost" size="sm" onClick={markAllRead}>Mark read</Button>
        </div>
        <div className="space-y-1">
          {notifications.length === 0 ? (
            <p className="px-2 py-5 text-center text-sm text-stone-500 dark:text-stone-400">No notifications yet.</p>
          ) : notifications.map((notification) => (
            <div key={notification.id} className="rounded-md p-2 hover:bg-stone-100 dark:hover:bg-stone-900">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{notification.title}</p>
                {!notification.read ? <Badge variant="danger">New</Badge> : null}
              </div>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{notification.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Dropdown>
  );
}

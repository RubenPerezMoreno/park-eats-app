import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Package, Tag, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const notificationIcons: Record<NotificationType, typeof Package> = {
  order_status: Package,
  promotion: Tag,
  news: Info,
};

const notificationColors: Record<NotificationType, string> = {
  order_status: 'bg-park-blue/10 text-park-blue',
  promotion: 'bg-park-orange/10 text-park-orange',
  news: 'bg-primary/10 text-primary',
};

export default function NotificationsScreen() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-primary"
              >
                <Check className="w-4 h-4 mr-1" />
                Marcar leídas
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notificationIcons[notification.type];
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'bg-card rounded-2xl p-4 cursor-pointer transition-all',
                    !notification.isRead && 'border-l-4 border-primary shadow-card'
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      notificationColors[notification.type]
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={cn(
                          'font-medium line-clamp-1',
                          !notification.isRead && 'text-foreground',
                          notification.isRead && 'text-muted-foreground'
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Clear all button */}
            <Button
              variant="ghost"
              onClick={clearNotifications}
              className="w-full text-muted-foreground mt-4"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Borrar todas
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Sin notificaciones</h3>
            <p className="text-muted-foreground">
              Aquí aparecerán tus notificaciones
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

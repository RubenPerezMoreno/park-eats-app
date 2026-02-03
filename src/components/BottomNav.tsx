import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, ShoppingBag, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/home', icon: Home, label: 'Inicio' },
  { path: '/map', icon: Map, label: 'Mapa' },
  { path: '/orders', icon: ShoppingBag, label: 'Pedidos' },
  { path: '/notifications', icon: Bell, label: 'Alertas' },
  { path: '/profile', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  const location = useLocation();
  const { getItemCount } = useCart();
  const { unreadCount } = useNotifications();
  const cartCount = getItemCount();

  // Hide bottom nav on certain screens
  const hiddenPaths = ['/store/', '/cart', '/checkout', '/order-tracking'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/home' && location.pathname === '/');
          const Icon = item.icon;
          const showBadge = (item.path === '/orders' && cartCount > 0) ||
            (item.path === '/notifications' && unreadCount > 0);
          const badgeCount = item.path === '/orders' ? cartCount : unreadCount;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center py-2 px-4 relative transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')} />
                {showBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1"
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

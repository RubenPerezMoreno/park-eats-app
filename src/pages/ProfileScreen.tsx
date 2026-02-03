import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Settings,
  Star,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const menuItems = [
  { icon: MapPin, label: 'Direcciones guardadas', path: '/addresses' },
  { icon: CreditCard, label: 'Métodos de pago', path: '/payment-methods' },
  { icon: Bell, label: 'Notificaciones', path: '/notification-settings' },
  { icon: Star, label: 'Mis reseñas', path: '/my-reviews' },
  { icon: Shield, label: 'Privacidad', path: '/privacy' },
  { icon: HelpCircle, label: 'Ayuda y soporte', path: '/help' },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary pt-12 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 overflow-hidden border-4 border-primary-foreground/30">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">
              {user?.name || 'Usuario'}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {user?.email || 'email@ejemplo.com'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 -mt-4"
      >
        <div className="bg-card rounded-2xl p-4 shadow-card grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Pedidos</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-primary">4</p>
            <p className="text-xs text-muted-foreground">Reseñas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-xs text-muted-foreground">Favoritos</p>
          </div>
        </div>
      </motion.div>

      {/* Menu items */}
      <div className="px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.03 }}
          >
            <button
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Notifications toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-6"
      >
        <div className="flex items-center justify-between p-4 bg-card rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Recibir notificaciones</span>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
      </motion.div>

      {/* Logout button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4"
      >
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-12 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar sesión
        </Button>
      </motion.div>

      {/* App version */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        ParkEat v1.0.0
      </p>
    </div>
  );
}

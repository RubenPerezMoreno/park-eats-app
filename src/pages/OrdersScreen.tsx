import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Clock, RefreshCw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/contexts/OrderContext';
import { useCart } from '@/contexts/CartContext';
import { orderStatusLabels, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-park-yellow text-foreground',
  confirmed: 'bg-park-blue text-primary-foreground',
  preparing: 'bg-park-orange text-primary-foreground',
  ready: 'bg-primary text-primary-foreground',
  delivering: 'bg-park-blue text-primary-foreground',
  delivered: 'bg-park-success text-primary-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

export default function OrdersScreen() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { cart, getItemCount } = useCart();

  const cartItemCount = getItemCount();

  const activeOrders = useMemo(() => {
    return orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  }, [orders]);

  const pastOrders = useMemo(() => {
    return orders.filter(order => 
      ['delivered', 'cancelled'].includes(order.status)
    );
  }, [orders]);

  const formatDate = (date: Date) => {
    return format(new Date(date), "d MMM, HH:mm", { locale: es });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-foreground">Mis Pedidos</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Current cart */}
        {cart && cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Carrito actual
            </h2>
            <div
              onClick={() => navigate('/cart')}
              className="bg-accent rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{cart.storeName || 'Carrito'}</p>
                    <p className="text-sm text-muted-foreground">
                      {cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Active orders */}
        {activeOrders.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Pedidos activos
            </h2>
            <div className="space-y-3">
              {activeOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                  className="bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.storeImage}
                          alt={order.storeName}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium">{order.storeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn('rounded-full', statusColors[order.status])}>
                        {orderStatusLabels[order.status]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{order.estimatedDelivery}</span>
                      </div>
                      <p className="font-semibold">{order.total.toFixed(2)}€</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Past orders */}
        {pastOrders.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Historial
            </h2>
            <div className="space-y-3">
              {pastOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-card"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.storeImage}
                          alt={order.storeName}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium">{order.storeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge className={cn('rounded-full', statusColors[order.status])}>
                        {orderStatusLabels[order.status]}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3">
                      {order.items.map(item => item.product.name).join(', ')}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/store/${order.storeId}`);
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Repetir
                      </Button>
                      <p className="font-semibold">{order.total.toFixed(2)}€</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 && !cart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tienes pedidos</h3>
            <p className="text-muted-foreground mb-6">
              Explora los comercios cercanos y haz tu primer pedido
            </p>
            <Button
              onClick={() => navigate('/home')}
              className="rounded-full gradient-primary"
            >
              Ver comercios
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

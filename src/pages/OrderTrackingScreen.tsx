import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  MapPin, 
  Phone,
  ChefHat,
  Bike,
  Package,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/contexts/OrderContext';
import { OrderStatus, orderStatusLabels } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusSteps: { status: OrderStatus; icon: typeof Check; label: string }[] = [
  { status: 'confirmed', icon: Check, label: 'Confirmado' },
  { status: 'preparing', icon: ChefHat, label: 'En preparación' },
  { status: 'ready', icon: Package, label: 'Listo' },
  { status: 'delivering', icon: Bike, label: 'En camino' },
  { status: 'delivered', icon: Home, label: 'Entregado' },
];

export default function OrderTrackingScreen() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, orders } = useOrders();
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get fresh order data
  const order = useMemo(() => getOrderById(orderId || ''), [orderId, orders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentStepIndex = useMemo(() => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.status === order.status);
  }, [order]);

  const formatOrderTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: es });
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Pedido no encontrado</p>
      </div>
    );
  }

  const isCompleted = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-primary pt-12 pb-24 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/orders')}
            className="rounded-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">
              Seguimiento del pedido
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Pedido #{order.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Estimated time */}
        {!isCompleted && !isCancelled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2 mb-2">
              <Clock className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">
                Tiempo estimado
              </span>
            </div>
            <p className="text-4xl font-bold text-primary-foreground">
              {order.estimatedDelivery}
            </p>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary-foreground flex items-center justify-center">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary-foreground">
              ¡Pedido entregado!
            </p>
          </motion.div>
        )}
      </div>

      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 -mt-16"
      >
        <div className="bg-card rounded-2xl p-6 shadow-lg">
          {/* Store info */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <img
              src={order.storeImage}
              alt={order.storeName}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-medium">{order.storeName}</h3>
              <p className="text-sm text-muted-foreground">
                Pedido a las {formatOrderTime(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="mt-6 space-y-0">
            {statusSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex">
                  {/* Icon column */}
                  <div className="flex flex-col items-center mr-4">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isComplete || isActive 
                          ? 'hsl(var(--primary))' 
                          : 'hsl(var(--muted))',
                        scale: isActive ? 1.1 : 1,
                      }}
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        isActive && 'ring-4 ring-primary/20'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5',
                        (isComplete || isActive) ? 'text-primary-foreground' : 'text-muted-foreground'
                      )} />
                    </motion.div>
                    {index < statusSteps.length - 1 && (
                      <div className={cn(
                        'w-0.5 h-8 my-1',
                        isComplete ? 'bg-primary' : 'bg-muted'
                      )} />
                    )}
                  </div>

                  {/* Content column */}
                  <div className="flex-1 pb-6">
                    <p className={cn(
                      'font-medium',
                      isActive && 'text-primary',
                      !isActive && !isComplete && 'text-muted-foreground'
                    )}>
                      {step.label}
                    </p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground mt-1"
                      >
                        {step.status === 'confirmed' && 'Hemos recibido tu pedido'}
                        {step.status === 'preparing' && 'El comercio está preparando tu pedido'}
                        {step.status === 'ready' && 'Tu pedido está listo para entregar'}
                        {step.status === 'delivering' && 'Tu pedido va en camino'}
                        {step.status === 'delivered' && '¡Disfruta de tu pedido!'}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Order details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 mt-4"
      >
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <h3 className="font-medium mb-3">Detalles del pedido</h3>
          
          <div className="space-y-2 text-sm">
            {order.items.map(item => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name}
                </span>
                <span>{(item.product.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
            
            <div className="flex justify-between pt-2 border-t border-border font-bold">
              <span>Total</span>
              <span className="text-primary">{order.total.toFixed(2)}€</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Mesa {order.tableCode}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Back to home button */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 mt-6"
        >
          <Button
            onClick={() => navigate('/home')}
            className="w-full h-12 rounded-xl gradient-primary"
          >
            Volver al inicio
          </Button>
        </motion.div>
      )}
    </div>
  );
}

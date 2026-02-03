import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { PaymentMethod, paymentMethodLabels } from '@/types';
import { getStoresWithProducts } from '@/data/mockData';
import { cn } from '@/lib/utils';

const paymentMethods: { method: PaymentMethod; icon: typeof CreditCard; color: string }[] = [
  { method: 'card', icon: CreditCard, color: 'bg-park-blue/10 text-park-blue' },
  { method: 'bizum', icon: Smartphone, color: 'bg-park-orange/10 text-park-orange' },
  { method: 'apple_pay', icon: Smartphone, color: 'bg-foreground/10 text-foreground' },
  { method: 'google_pay', icon: Smartphone, color: 'bg-primary/10 text-primary' },
  { method: 'cash', icon: Banknote, color: 'bg-park-success/10 text-park-success' },
];

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getSubtotal, getServiceFee, getTotal, clearCart } = useCart();
  const { createOrder, simulateOrderProgress } = useOrders();
  const { addNotification } = useNotifications();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const stores = useMemo(() => getStoresWithProducts(), []);
  const store = stores.find(s => s.id === cart?.storeId);

  const orderNotes = location.state?.orderNotes || '';

  const subtotal = getSubtotal();
  const serviceFee = getServiceFee();
  const total = getTotal();

  const handlePayment = async () => {
    if (!cart || !store) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const order = createOrder({
      storeId: cart.storeId,
      storeName: store.name,
      storeImage: store.image,
      items: cart.items,
      subtotal,
      serviceFee,
      total,
      tableCode: cart.tableCode || '',
      paymentMethod: selectedMethod,
      notes: orderNotes,
    });

    // Add notification
    addNotification({
      type: 'order_status',
      title: '¡Pedido realizado!',
      message: `Tu pedido en ${store.name} ha sido confirmado`,
      data: { orderId: order.id, storeId: store.id },
    });

    setIsProcessing(false);
    setIsSuccess(true);

    // Simulate order progress
    simulateOrderProgress(order.id);

    // Clear cart and navigate after animation
    setTimeout(() => {
      clearCart();
      navigate(`/order-tracking/${order.id}`, { replace: true });
    }, 2000);
  };

  if (!cart || cart.items.length === 0) {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
            disabled={isProcessing || isSuccess}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Método de pago</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <img
              src={store?.image}
              alt={store?.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium">{store?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'} • Mesa {cart.tableCode}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {cart.items.map(item => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name}
                </span>
                <span>{(item.product.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gastos de servicio</span>
              <span>{serviceFee.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{total.toFixed(2)}€</span>
            </div>
          </div>
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Selecciona método de pago
          </h2>
          <div className="space-y-2">
            {paymentMethods.map(({ method, icon: Icon, color }, index) => (
              <motion.button
                key={method}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedMethod(method)}
                disabled={isProcessing || isSuccess}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all',
                  selectedMethod === method
                    ? 'border-primary bg-accent'
                    : 'border-border bg-card hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{paymentMethodLabels[method]}</span>
                </div>
                {selectedMethod === method && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || isSuccess}
          className="w-full h-14 rounded-xl text-lg gradient-primary"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Procesando pago...
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              ¡Pago completado!
            </>
          ) : (
            <>Pagar {total.toFixed(2)}€</>
          )}
        </Button>
      </div>

      {/* Success overlay */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-primary flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-foreground flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-primary-foreground mb-2"
            >
              ¡Pago exitoso!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-primary-foreground/80"
            >
              Tu pedido está siendo preparado
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  QrCode,
  ShoppingBag,
  StickyNote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export default function CartScreen() {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    setTableCode,
    getSubtotal,
    getServiceFee,
    getTotal,
    clearCart
  } = useCart();
  const [tableCode, setTableCodeLocal] = useState(cart?.tableCode || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const subtotal = getSubtotal();
  const serviceFee = getServiceFee();
  const total = getTotal();

  const handleTableCodeChange = (code: string) => {
    setTableCodeLocal(code);
    setTableCode(code);
  };

  const simulateScanQR = () => {
    // Simulate QR scan result
    const mockQRCodes = ['MESA-A1', 'MESA-A2', 'MESA-B3', 'MESA-C5', 'MESA-D7'];
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    handleTableCodeChange(randomCode);
    setShowScanner(false);
  };

  const handleProceedToPayment = () => {
    if (!tableCode) {
      return;
    }
    navigate('/checkout', { state: { orderNotes } });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="sticky top-0 z-20 bg-background border-b border-border">
          <div className="px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Carrito</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground text-center mb-6">
            Explora los comercios y añade productos
          </p>
          <Button
            onClick={() => navigate('/home')}
            className="rounded-full gradient-primary"
          >
            Ver comercios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Carrito</h1>
              <p className="text-sm text-muted-foreground">{cart.storeName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive"
          >
            Vaciar
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Cart items */}
        <div className="space-y-3">
          {cart.items.map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl p-3 shadow-card"
            >
              <div className="flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.price.toFixed(2)}€ / unidad
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="rounded-full w-8 h-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="rounded-full w-8 h-8"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-destructive w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table code / QR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Código de mesa</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ej: MESA-A3"
              value={tableCode}
              onChange={(e) => handleTableCodeChange(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={simulateScanQR}
              className="px-4"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Escanear
            </Button>
          </div>
          {!tableCode && (
            <p className="text-xs text-muted-foreground mt-2">
              Escanea el código QR de tu mesa o introdúcelo manualmente
            </p>
          )}
        </motion.div>

        {/* Order notes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Notas del pedido</h3>
          </div>
          <Textarea
            placeholder="Ej: Sin gluten, alergia a frutos secos..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            rows={2}
          />
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-4 shadow-card"
        >
          <h3 className="font-medium mb-3">Resumen del pedido</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
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
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <Button
          onClick={handleProceedToPayment}
          disabled={!tableCode}
          className={cn(
            'w-full h-14 rounded-xl text-lg',
            tableCode ? 'gradient-primary' : 'bg-muted text-muted-foreground'
          )}
        >
          Continuar al pago • {total.toFixed(2)}€
        </Button>
      </div>
    </div>
  );
}

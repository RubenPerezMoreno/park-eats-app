import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Plus, 
  Minus,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStoresWithProducts, mockReviews } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { Product, storeCategoryLabels } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function StoreDetailScreen() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, addToCart, getItemCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const stores = useMemo(() => getStoresWithProducts(), []);
  const store = stores.find(s => s.id === storeId);
  const storeReviews = mockReviews.filter(r => r.storeId === storeId);

  const productCategories = useMemo(() => {
    if (!store) return [];
    const categories = [...new Set(store.products.map(p => p.category))];
    return categories;
  }, [store]);

  const cartItemCount = getItemCount();
  const isCartFromDifferentStore = cart && cart.storeId !== storeId;

  const handleAddToCart = (product: Product) => {
    if (isCartFromDifferentStore) {
      toast({
        title: 'Carrito existente',
        description: 'Tienes productos de otro comercio. ¿Quieres vaciar el carrito?',
        variant: 'destructive',
      });
      return;
    }
    
    addToCart(product, quantity);
    
    // Update cart store name if needed
    if (store) {
      const savedCart = localStorage.getItem('parkeat_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        cartData.storeName = store.name;
        localStorage.setItem('parkeat_cart', JSON.stringify(cartData));
      }
    }
    
    toast({
      title: 'Añadido al carrito',
      description: `${quantity}x ${product.name}`,
    });
    
    setSelectedProduct(null);
    setQuantity(1);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Comercio no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with cover image */}
      <div className="relative h-56">
        <img
          src={store.coverImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full w-10 h-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full w-10 h-10"
        >
          <Heart className={cn(
            'w-5 h-5',
            isFavorite && 'fill-destructive text-destructive'
          )} />
        </Button>
      </div>

      {/* Store info */}
      <div className="px-4 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-start gap-4">
            <img
              src={store.image}
              alt={store.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold">{store.name}</h1>
              <p className="text-sm text-muted-foreground">
                {storeCategoryLabels[store.category]}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="flex items-center gap-1 text-park-orange font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {store.rating} ({store.reviewCount})
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {store.deliveryTime}
                </span>
              </div>
            </div>
            <Badge 
              variant={store.isOpen ? 'default' : 'secondary'}
              className={cn(
                'rounded-full',
                store.isOpen && 'bg-park-success text-primary-foreground'
              )}
            >
              {store.isOpen ? 'Abierto' : 'Cerrado'}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
            {store.description}
          </p>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {store.address}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {store.phone}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Menu tabs */}
      <div className="px-4 mt-6">
        <Tabs defaultValue="menu">
          <TabsList className="w-full bg-muted rounded-xl p-1 h-auto">
            <TabsTrigger value="menu" className="flex-1 rounded-lg py-2">
              Menú
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 rounded-lg py-2">
              Reseñas ({storeReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-4">
            {productCategories.map((category, catIndex) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="space-y-3">
                  {store.products
                    .filter(p => p.category === category)
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                        onClick={() => {
                          setSelectedProduct(product);
                          setQuantity(1);
                        }}
                        className="bg-card rounded-xl overflow-hidden shadow-card cursor-pointer active:scale-[0.98] transition-transform"
                      >
                        <div className="flex">
                          <div className="flex-1 p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{product.name}</h4>
                                {product.isPopular && (
                                  <Badge variant="secondary" className="mt-1 text-[10px] bg-park-orange-light text-park-orange">
                                    ⭐ Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {product.description}
                            </p>
                            <p className="text-lg font-bold text-primary mt-2">
                              {product.price.toFixed(2)}€
                            </p>
                          </div>
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {storeReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                        {review.userName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{review.userName}</h4>
                        <div className="flex items-center gap-1 text-park-orange">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-3.5 h-3.5',
                                i < review.rating ? 'fill-current' : 'text-muted'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {review.comment}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {storeReviews.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aún no hay reseñas para este comercio
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl overflow-hidden"
            >
              <div className="h-48 relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>

              <div className="p-6 -mt-8 relative z-10">
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <p className="text-muted-foreground mt-2">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-2xl font-bold text-primary">
                    {(selectedProduct.price * quantity).toFixed(2)}€
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="rounded-full w-10 h-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-full w-10 h-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="w-full h-14 mt-6 rounded-xl text-lg gradient-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Añadir al carrito
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating cart button */}
      {cartItemCount > 0 && cart?.storeId === storeId && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 z-40"
        >
          <Button
            onClick={() => navigate('/cart')}
            className="w-full h-14 rounded-2xl text-lg gradient-primary shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Ver carrito ({cartItemCount})
          </Button>
        </motion.div>
      )}
    </div>
  );
}

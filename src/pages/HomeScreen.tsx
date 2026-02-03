import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoresWithProducts } from '@/data/mockData';
import { StoreCategory, storeCategoryLabels, storeCategoryIcons } from '@/types';
import { cn } from '@/lib/utils';

const categories: { value: StoreCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Todos', icon: '🏪' },
  { value: 'panaderia', label: 'Panadería', icon: '🥐' },
  { value: 'heladeria', label: 'Heladería', icon: '🍦' },
  { value: 'cafeteria', label: 'Cafetería', icon: '☕' },
  { value: 'fruteria', label: 'Frutería', icon: '🍎' },
  { value: 'bocateria', label: 'Bocatería', icon: '🥪' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | 'all'>('all');

  const stores = useMemo(() => getStoresWithProducts(), []);

  const filteredStores = useMemo(() => {
    return stores
      .filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [stores, searchQuery, selectedCategory]);

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 pt-6 pb-4">
          {/* Location header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tu ubicación</p>
              <p className="text-sm font-medium">Parque del Retiro, Madrid</p>
            </div>
          </motion.div>

          {/* Search bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar comercios o productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 rounded-xl bg-muted border-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Filter className="w-5 h-5 text-muted-foreground" />
            </Button>
          </motion.div>
        </div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 pb-3 overflow-x-auto hide-scrollbar"
        >
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'rounded-full whitespace-nowrap px-4',
                  selectedCategory === category.value && 'gradient-primary'
                )}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stores list */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Comercios cerca de ti
          </h2>
          <Badge variant="secondary" className="rounded-full">
            {filteredStores.length} resultados
          </Badge>
        </div>

        <div className="space-y-4">
          {filteredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/store/${store.id}`)}
              className="bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex">
                {/* Store image */}
                <div className="w-28 h-28 flex-shrink-0">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Store info */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {store.name}
                      </h3>
                      <Badge 
                        variant={store.isOpen ? 'default' : 'secondary'}
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full flex-shrink-0',
                          store.isOpen && 'bg-park-success text-primary-foreground'
                        )}
                      >
                        {store.isOpen ? 'Abierto' : 'Cerrado'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {storeCategoryIcons[store.category]} {storeCategoryLabels[store.category]}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-park-orange font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {store.rating}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {formatDistance(store.distance)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {store.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No se encontraron comercios
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

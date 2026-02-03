import { useEffect, useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from '@/contexts/LocationContext';
import { getStoresWithProducts, DEMO_LOCATION } from '@/data/mockData';
import { Store, storeCategoryLabels, storeCategoryIcons } from '@/types';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createIcon = (emoji: string, isUser: boolean = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${isUser ? '32px' : '40px'};
        height: ${isUser ? '32px' : '40px'};
        background: ${isUser ? 'hsl(210, 90%, 55%)' : 'hsl(0, 0%, 100%)'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isUser ? '16px' : '20px'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        border: 3px solid ${isUser ? 'hsl(210, 90%, 45%)' : 'hsl(142, 70%, 45%)'};
      ">
        ${isUser ? '📍' : emoji}
      </div>
    `,
    iconSize: [isUser ? 32 : 40, isUser ? 32 : 40],
    iconAnchor: [isUser ? 16 : 20, isUser ? 32 : 40],
    popupAnchor: [0, -40],
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function MapScreen() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const stores = useMemo(() => getStoresWithProducts(), []);
  
  const userPosition: [number, number] = useMemo(() => {
    return [location?.lat || DEMO_LOCATION.lat, location?.lng || DEMO_LOCATION.lng];
  }, [location]);

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
  };

  const handleNavigateToStore = () => {
    if (selectedStore) {
      navigate(`/store/${selectedStore.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-0">
      {/* Map */}
      <MapContainer
        center={userPosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapController center={userPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User marker */}
        <Marker 
          position={userPosition} 
          icon={createIcon('', true)}
        >
          <Popup>
            <div className="text-center p-2">
              <p className="font-medium">Tu ubicación</p>
            </div>
          </Popup>
        </Marker>

        {/* Store markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={[store.coordinates.lat, store.coordinates.lng]}
            icon={createIcon(storeCategoryIcons[store.category])}
            eventHandlers={{
              click: () => handleStoreClick(store),
            }}
          />
        ))}
      </MapContainer>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pt-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Comercios cercanos</p>
              <p className="text-sm font-medium">{stores.length} disponibles en tu zona</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Selected store card */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-24 left-4 right-4 z-[1000]"
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-background/80 rounded-full w-8 h-8"
                onClick={() => setSelectedStore(null)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="flex">
                {/* Store image */}
                <div className="w-28 h-28 flex-shrink-0">
                  <img
                    src={selectedStore.image}
                    alt={selectedStore.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Store info */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {selectedStore.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {storeCategoryIcons[selectedStore.category]} {storeCategoryLabels[selectedStore.category]}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-park-orange font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {selectedStore.rating}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {formatDistance(selectedStore.distance)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedStore.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="p-3 pt-0">
                <Button
                  onClick={handleNavigateToStore}
                  className="w-full h-11 rounded-xl gradient-primary"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Ver menú y pedir
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacing for nav */}
      <div className="h-24" />
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';

interface LocationPermissionScreenProps {
  onComplete: () => void;
}

export default function LocationPermissionScreen({ onComplete }: LocationPermissionScreenProps) {
  const { requestPermission, skipPermission, isLoading, error } = useLocation();
  const [showError, setShowError] = useState(false);

  const handleAllow = async () => {
    const success = await requestPermission();
    if (success) {
      onComplete();
    } else {
      setShowError(true);
      // Auto-continue after showing error
      setTimeout(() => onComplete(), 2000);
    }
  };

  const handleSkip = () => {
    skipPermission();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Icon animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          {/* Pulse effect */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/20"
          />
          <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center relative z-10">
            <MapPin className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-foreground mb-4"
        >
          Permitir ubicación
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-2 leading-relaxed max-w-xs"
        >
          Necesitamos tu ubicación para mostrarte los comercios más cercanos y calcular los tiempos de entrega.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground/70 mb-8"
        >
          Tu ubicación solo se usa mientras usas la app.
        </motion.p>

        {/* Error message */}
        {(showError || error) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              {error || 'No se pudo obtener la ubicación. Usando ubicación por defecto.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="p-8 pb-12 space-y-3">
        <Button
          onClick={handleAllow}
          className="w-full h-14 text-lg rounded-2xl gradient-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Obteniendo ubicación...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-5 w-5" />
              Permitir ubicación
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={handleSkip}
          className="w-full h-12 text-muted-foreground"
          disabled={isLoading}
        >
          Continuar sin ubicación
        </Button>
      </div>
    </div>
  );
}

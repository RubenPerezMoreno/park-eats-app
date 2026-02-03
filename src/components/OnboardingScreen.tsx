import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, QrCode, ShoppingBag } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: MapPin,
    emoji: '📍',
    title: 'Encuentra comercios cercanos',
    description: 'Descubre panaderías, cafeterías, heladerías y más comercios locales cerca de ti en el parque.',
  },
  {
    icon: QrCode,
    emoji: '📱',
    title: 'Escanea y pide',
    description: 'Escanea el código QR de tu mesa y realiza tu pedido cómodamente desde tu móvil.',
  },
  {
    icon: ShoppingBag,
    emoji: '🛍️',
    title: 'Recibe en tu mesa',
    description: 'Disfruta de tu comida mientras te la llevan directamente a tu ubicación en el parque.',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          Saltar
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-sm"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-accent flex items-center justify-center">
                <span className="text-6xl">{slides[currentSlide].emoji}</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-2xl font-bold text-foreground mb-4"
            >
              {slides[currentSlide].title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-muted-foreground leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-8 pb-12">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: index === currentSlide ? 24 : 8,
                backgroundColor: index === currentSlide 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--muted-foreground) / 0.3)',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full cursor-pointer"
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg rounded-2xl gradient-primary"
        >
          {currentSlide === slides.length - 1 ? 'Empezar' : 'Siguiente'}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

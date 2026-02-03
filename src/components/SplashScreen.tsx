import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Start logo animation after a short delay
    const logoTimer = setTimeout(() => setShowLogo(true), 200);
    
    // Complete splash screen after animation
    const completeTimer = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showLogo ? 1 : 0, 
          scale: showLogo ? 1 : 0.8 
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        className="text-center"
      >
        {/* Logo Icon */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-4"
        >
          <div className="w-24 h-24 mx-auto bg-primary-foreground rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🌳</span>
          </div>
        </motion.div>

        {/* Logo Text */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-bold text-primary-foreground tracking-tight"
        >
          Park<span className="font-light">Eat</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-2 text-primary-foreground/80 text-sm"
        >
          Pide desde el parque
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 flex justify-center gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-2 h-2 rounded-full bg-primary-foreground/60"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

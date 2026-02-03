import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { UserLocation } from '@/types';
import { DEMO_LOCATION } from '@/data/mockData';

interface LocationContextType {
  location: UserLocation | null;
  permissionStatus: 'pending' | 'granted' | 'denied' | 'unavailable';
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  skipPermission: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'unavailable'>(() => {
    const saved = localStorage.getItem('parkeat_location_permission');
    return (saved as any) || 'pending';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      setError('La geolocalización no está disponible en este dispositivo');
      // Use demo location as fallback
      setLocation(DEMO_LOCATION);
      localStorage.setItem('parkeat_location_permission', 'unavailable');
      return false;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(userLocation);
          setPermissionStatus('granted');
          setIsLoading(false);
          localStorage.setItem('parkeat_location_permission', 'granted');
          localStorage.setItem('parkeat_location', JSON.stringify(userLocation));
          resolve(true);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setPermissionStatus('denied');
          setError('No se pudo obtener tu ubicación');
          // Use demo location as fallback
          setLocation(DEMO_LOCATION);
          setIsLoading(false);
          localStorage.setItem('parkeat_location_permission', 'denied');
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  const skipPermission = useCallback(() => {
    setPermissionStatus('denied');
    setLocation(DEMO_LOCATION);
    localStorage.setItem('parkeat_location_permission', 'denied');
  }, []);

  // Try to restore location from localStorage on mount
  useEffect(() => {
    if (permissionStatus === 'granted') {
      const savedLocation = localStorage.getItem('parkeat_location');
      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
    } else if (permissionStatus !== 'pending') {
      setLocation(DEMO_LOCATION);
    }
  }, [permissionStatus]);

  return (
    <LocationContext.Provider value={{
      location,
      permissionStatus,
      isLoading,
      error,
      requestPermission,
      skipPermission,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

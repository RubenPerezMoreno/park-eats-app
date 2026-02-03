import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LocationProvider, useLocation } from "@/contexts/LocationContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

// Screens
import SplashScreen from "@/components/SplashScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import AuthScreen from "@/components/AuthScreen";
import LocationPermissionScreen from "@/components/LocationPermissionScreen";
import BottomNav from "@/components/BottomNav";
import HomeScreen from "@/pages/HomeScreen";
import MapScreen from "@/pages/MapScreen";
import OrdersScreen from "@/pages/OrdersScreen";
import ProfileScreen from "@/pages/ProfileScreen";
import NotificationsScreen from "@/pages/NotificationsScreen";
import StoreDetailScreen from "@/pages/StoreDetailScreen";
import CartScreen from "@/pages/CartScreen";
import CheckoutScreen from "@/pages/CheckoutScreen";
import OrderTrackingScreen from "@/pages/OrderTrackingScreen";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { permissionStatus } = useLocation();
  
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('parkeat_onboarding_complete');
    if (!hasSeenOnboarding && !isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && permissionStatus === 'pending') {
      setShowLocationPermission(true);
    }
  }, [isAuthenticated, permissionStatus]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    if (showOnboarding) {
      return (
        <OnboardingScreen 
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('parkeat_onboarding_complete', 'true');
          }} 
        />
      );
    }
    return <AuthScreen onSuccess={() => setShowLocationPermission(permissionStatus === 'pending')} />;
  }

  if (showLocationPermission && permissionStatus === 'pending') {
    return <LocationPermissionScreen onComplete={() => setShowLocationPermission(false)} />;
  }

  return (
    <div className="mobile-container">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/orders" element={<OrdersScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/store/:storeId" element={<StoreDetailScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/order-tracking/:orderId" element={<OrderTrackingScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <OrderProvider>
              <NotificationProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </NotificationProvider>
            </OrderProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

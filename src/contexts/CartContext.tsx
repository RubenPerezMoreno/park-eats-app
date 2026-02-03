import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart | null;
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  setTableCode: (code: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getServiceFee: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SERVICE_FEE_PERCENTAGE = 0.05; // 5% service fee
const MIN_SERVICE_FEE = 0.50;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(() => {
    const saved = localStorage.getItem('parkeat_cart');
    return saved ? JSON.parse(saved) : null;
  });

  const saveCart = useCallback((newCart: Cart | null) => {
    setCart(newCart);
    if (newCart) {
      localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
    } else {
      localStorage.removeItem('parkeat_cart');
    }
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1, notes?: string) => {
    setCart(prevCart => {
      // If cart is empty or from different store, create new cart
      if (!prevCart || prevCart.storeId !== product.storeId) {
        const newCart: Cart = {
          storeId: product.storeId,
          storeName: '', // Will be set by the component
          items: [{ product, quantity, notes }],
        };
        localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
        return newCart;
      }

      // Check if product already in cart
      const existingIndex = prevCart.items.findIndex(item => item.product.id === product.id);
      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = prevCart.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity, notes }];
      }

      const newCart = { ...prevCart, items: newItems };
      localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => {
      if (!prevCart) return null;
      
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      
      if (newItems.length === 0) {
        localStorage.removeItem('parkeat_cart');
        return null;
      }

      const newCart = { ...prevCart, items: newItems };
      localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      if (!prevCart) return null;
      
      const newItems = prevCart.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      const newCart = { ...prevCart, items: newItems };
      localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
      return newCart;
    });
  }, [removeFromCart]);

  const updateNotes = useCallback((productId: string, notes: string) => {
    setCart(prevCart => {
      if (!prevCart) return null;
      
      const newItems = prevCart.items.map(item =>
        item.product.id === productId ? { ...item, notes } : item
      );

      const newCart = { ...prevCart, items: newItems };
      localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const setTableCode = useCallback((code: string) => {
    setCart(prevCart => {
      if (!prevCart) return null;
      const newCart = { ...prevCart, tableCode: code };
      localStorage.setItem('parkeat_cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart(null);
  }, [saveCart]);

  const getItemCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getSubtotal = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const getServiceFee = useCallback(() => {
    const subtotal = getSubtotal();
    const fee = subtotal * SERVICE_FEE_PERCENTAGE;
    return Math.max(fee, subtotal > 0 ? MIN_SERVICE_FEE : 0);
  }, [getSubtotal]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getServiceFee();
  }, [getSubtotal, getServiceFee]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateNotes,
      setTableCode,
      clearCart,
      getItemCount,
      getSubtotal,
      getServiceFee,
      getTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

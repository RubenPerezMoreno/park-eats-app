import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order, OrderStatus, CartItem, PaymentMethod } from '@/types';
import { mockOrderHistory } from '@/data/mockData';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (params: CreateOrderParams) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  simulateOrderProgress: (orderId: string) => void;
}

interface CreateOrderParams {
  storeId: string;
  storeName: string;
  storeImage: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  tableCode: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('parkeat_orders');
    return saved ? JSON.parse(saved) : mockOrderHistory;
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const saveOrders = useCallback((newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('parkeat_orders', JSON.stringify(newOrders));
  }, []);

  const createOrder = useCallback((params: CreateOrderParams): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      storeId: params.storeId,
      storeName: params.storeName,
      storeImage: params.storeImage,
      items: params.items,
      status: 'pending',
      subtotal: params.subtotal,
      serviceFee: params.serviceFee,
      total: params.total,
      tableCode: params.tableCode,
      paymentMethod: params.paymentMethod,
      createdAt: new Date(),
      estimatedDelivery: '15-20 min',
      notes: params.notes,
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    setCurrentOrder(newOrder);

    return newOrder;
  }, [orders, saveOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem('parkeat_orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  }, [currentOrder]);

  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const simulateOrderProgress = useCallback((orderId: string) => {
    const statusSequence: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusSequence.length) {
        updateOrderStatus(orderId, statusSequence[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds for demo

    // Initial status update
    updateOrderStatus(orderId, 'confirmed');
  }, [updateOrderStatus]);

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      createOrder,
      updateOrderStatus,
      getOrderById,
      simulateOrderProgress,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

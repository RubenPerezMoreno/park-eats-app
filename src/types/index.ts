// User types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

// Store types
export interface Store {
  id: string;
  name: string;
  description: string;
  category: StoreCategory;
  image: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distance: number; // in meters
  deliveryTime: string; // e.g., "10-15 min"
  isOpen: boolean;
  openingHours: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  products: Product[];
}

export type StoreCategory = 
  | 'panaderia' 
  | 'heladeria' 
  | 'cafeteria' 
  | 'fruteria' 
  | 'bocateria' 
  | 'bebidas'
  | 'snacks';

export const storeCategoryLabels: Record<StoreCategory, string> = {
  panaderia: 'Panadería',
  heladeria: 'Heladería',
  cafeteria: 'Cafetería',
  fruteria: 'Frutería',
  bocateria: 'Bocatería',
  bebidas: 'Bebidas',
  snacks: 'Snacks',
};

export const storeCategoryIcons: Record<StoreCategory, string> = {
  panaderia: '🥐',
  heladeria: '🍦',
  cafeteria: '☕',
  fruteria: '🍎',
  bocateria: '🥪',
  bebidas: '🥤',
  snacks: '🍿',
};

// Product types
export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Cart {
  storeId: string;
  storeName: string;
  items: CartItem[];
  tableCode?: string;
}

// Order types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'delivering' 
  | 'delivered' 
  | 'cancelled';

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'En preparación',
  ready: 'Listo',
  delivering: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  storeImage: string;
  items: CartItem[];
  status: OrderStatus;
  subtotal: number;
  serviceFee: number;
  total: number;
  tableCode: string;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDelivery?: string;
  notes?: string;
}

// Payment types
export type PaymentMethod = 
  | 'card' 
  | 'bizum' 
  | 'apple_pay' 
  | 'google_pay' 
  | 'cash';

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: 'Tarjeta de crédito/débito',
  bizum: 'Bizum',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  cash: 'Efectivo al recibir',
};

// Review types
export interface Review {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

// Notification types
export type NotificationType = 
  | 'order_status' 
  | 'promotion' 
  | 'news';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: {
    orderId?: string;
    storeId?: string;
  };
}

// Location types
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

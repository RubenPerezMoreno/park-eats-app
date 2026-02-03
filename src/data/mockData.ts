import { Store, Product, Review, Notification, Order } from '@/types';

// Demo user location (simulating a park in Madrid)
export const DEMO_LOCATION = {
  lat: 40.4168,
  lng: -3.7038,
};

// Mock stores data
export const mockStores: Store[] = [
  {
    id: 'store-1',
    name: 'Panadería La Espiga',
    description: 'Panadería artesanal con más de 30 años de tradición. Pan recién horneado, bollería casera y café de especialidad.',
    category: 'panaderia',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 156,
    distance: 150,
    deliveryTime: '10-15 min',
    isOpen: true,
    openingHours: '07:00 - 21:00',
    address: 'Paseo del Parque, 12',
    phone: '+34 912 345 678',
    coordinates: { lat: 40.4175, lng: -3.7045 },
    products: [],
  },
  {
    id: 'store-2',
    name: 'Heladería Polar',
    description: 'Helados artesanales con ingredientes naturales. Más de 40 sabores incluyendo opciones veganas y sin azúcar.',
    category: 'heladeria',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 243,
    distance: 230,
    deliveryTime: '8-12 min',
    isOpen: true,
    openingHours: '10:00 - 22:00',
    address: 'Avenida del Parque, 45',
    phone: '+34 913 456 789',
    coordinates: { lat: 40.4160, lng: -3.7020 },
    products: [],
  },
  {
    id: 'store-3',
    name: 'Cafetería El Roble',
    description: 'Café de especialidad, zumos naturales y snacks saludables. El lugar perfecto para una pausa en el parque.',
    category: 'cafeteria',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 98,
    distance: 340,
    deliveryTime: '12-18 min',
    isOpen: true,
    openingHours: '08:00 - 20:00',
    address: 'Calle del Jardín, 8',
    phone: '+34 914 567 890',
    coordinates: { lat: 40.4180, lng: -3.7060 },
    products: [],
  },
  {
    id: 'store-4',
    name: 'Frutería Natural',
    description: 'Fruta fresca de temporada, smoothies y ensaladas de frutas. Productos locales y ecológicos.',
    category: 'fruteria',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 67,
    distance: 420,
    deliveryTime: '10-15 min',
    isOpen: true,
    openingHours: '09:00 - 19:00',
    address: 'Plaza del Parque, 3',
    phone: '+34 915 678 901',
    coordinates: { lat: 40.4155, lng: -3.7050 },
    products: [],
  },
  {
    id: 'store-5',
    name: 'Bocatería Parque',
    description: 'Bocadillos gourmet, ensaladas frescas y wraps. Ingredientes de primera calidad para una comida rápida y deliciosa.',
    category: 'bocateria',
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 134,
    distance: 510,
    deliveryTime: '15-20 min',
    isOpen: true,
    openingHours: '10:00 - 21:00',
    address: 'Camino del Lago, 22',
    phone: '+34 916 789 012',
    coordinates: { lat: 40.4190, lng: -3.7025 },
    products: [],
  },
];

// Products for each store
export const mockProducts: Record<string, Product[]> = {
  'store-1': [
    { id: 'p1-1', storeId: 'store-1', name: 'Barra de pan artesanal', description: 'Pan recién horneado con masa madre', price: 1.50, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=300&fit=crop', category: 'Panes', isAvailable: true, isPopular: true },
    { id: 'p1-2', storeId: 'store-1', name: 'Croissant de mantequilla', description: 'Croissant hojaldrado con mantequilla francesa', price: 2.20, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop', category: 'Bollería', isAvailable: true, isPopular: true },
    { id: 'p1-3', storeId: 'store-1', name: 'Napolitana de chocolate', description: 'Hojaldre relleno de chocolate belga', price: 2.50, image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=300&h=300&fit=crop', category: 'Bollería', isAvailable: true },
    { id: 'p1-4', storeId: 'store-1', name: 'Café con leche', description: 'Café espresso con leche cremosa', price: 1.80, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop', category: 'Bebidas', isAvailable: true },
    { id: 'p1-5', storeId: 'store-1', name: 'Tostada con tomate', description: 'Pan tostado con tomate rallado y aceite', price: 2.80, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop', category: 'Desayunos', isAvailable: true },
    { id: 'p1-6', storeId: 'store-1', name: 'Palmera de chocolate', description: 'Hojaldre caramelizado con chocolate', price: 2.00, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=300&h=300&fit=crop', category: 'Bollería', isAvailable: true },
  ],
  'store-2': [
    { id: 'p2-1', storeId: 'store-2', name: 'Helado de chocolate', description: 'Helado artesanal de chocolate belga', price: 3.50, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop', category: 'Helados', isAvailable: true, isPopular: true },
    { id: 'p2-2', storeId: 'store-2', name: 'Helado de vainilla', description: 'Helado cremoso de vainilla de Madagascar', price: 3.50, image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=300&h=300&fit=crop', category: 'Helados', isAvailable: true },
    { id: 'p2-3', storeId: 'store-2', name: 'Helado de fresa', description: 'Helado natural de fresas frescas', price: 3.50, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=300&fit=crop', category: 'Helados', isAvailable: true, isPopular: true },
    { id: 'p2-4', storeId: 'store-2', name: 'Copa especial', description: '3 bolas con nata, sirope y toppings', price: 5.90, image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300&h=300&fit=crop', category: 'Copas', isAvailable: true },
    { id: 'p2-5', storeId: 'store-2', name: 'Granizado de limón', description: 'Granizado refrescante de limón natural', price: 2.80, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=300&h=300&fit=crop', category: 'Granizados', isAvailable: true },
    { id: 'p2-6', storeId: 'store-2', name: 'Batido de oreo', description: 'Batido cremoso con galletas oreo', price: 4.50, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop', category: 'Batidos', isAvailable: true },
  ],
  'store-3': [
    { id: 'p3-1', storeId: 'store-3', name: 'Café espresso', description: 'Café de especialidad de origen único', price: 1.50, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop', category: 'Cafés', isAvailable: true },
    { id: 'p3-2', storeId: 'store-3', name: 'Cappuccino', description: 'Espresso con leche espumada', price: 2.50, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop', category: 'Cafés', isAvailable: true, isPopular: true },
    { id: 'p3-3', storeId: 'store-3', name: 'Zumo de naranja', description: 'Zumo natural recién exprimido', price: 3.00, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=300&fit=crop', category: 'Zumos', isAvailable: true, isPopular: true },
    { id: 'p3-4', storeId: 'store-3', name: 'Tarta de zanahoria', description: 'Bizcocho casero con crema de queso', price: 4.00, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=300&fit=crop', category: 'Tartas', isAvailable: true },
    { id: 'p3-5', storeId: 'store-3', name: 'Smoothie verde', description: 'Espinacas, manzana, jengibre y limón', price: 4.50, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&h=300&fit=crop', category: 'Smoothies', isAvailable: true },
    { id: 'p3-6', storeId: 'store-3', name: 'Bagel con salmón', description: 'Bagel con salmón ahumado y queso crema', price: 6.50, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=300&h=300&fit=crop', category: 'Snacks', isAvailable: true },
  ],
  'store-4': [
    { id: 'p4-1', storeId: 'store-4', name: 'Macedonia de frutas', description: 'Mix de frutas frescas de temporada', price: 4.00, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300&h=300&fit=crop', category: 'Frutas', isAvailable: true, isPopular: true },
    { id: 'p4-2', storeId: 'store-4', name: 'Smoothie tropical', description: 'Mango, piña y coco', price: 4.50, image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=300&h=300&fit=crop', category: 'Smoothies', isAvailable: true, isPopular: true },
    { id: 'p4-3', storeId: 'store-4', name: 'Brocheta de frutas', description: 'Frutas variadas en brocheta', price: 3.50, image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300&h=300&fit=crop', category: 'Frutas', isAvailable: true },
    { id: 'p4-4', storeId: 'store-4', name: 'Zumo detox', description: 'Apio, pepino, manzana y limón', price: 4.00, image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300&h=300&fit=crop', category: 'Zumos', isAvailable: true },
    { id: 'p4-5', storeId: 'store-4', name: 'Bowl de açaí', description: 'Açaí con granola, frutas y miel', price: 6.50, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=300&fit=crop', category: 'Bowls', isAvailable: true },
    { id: 'p4-6', storeId: 'store-4', name: 'Sandía fresca', description: 'Porción de sandía natural', price: 2.50, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop', category: 'Frutas', isAvailable: true },
  ],
  'store-5': [
    { id: 'p5-1', storeId: 'store-5', name: 'Bocadillo de jamón ibérico', description: 'Pan artesanal con jamón ibérico de bellota', price: 8.50, image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=300&h=300&fit=crop', category: 'Bocadillos', isAvailable: true, isPopular: true },
    { id: 'p5-2', storeId: 'store-5', name: 'Wrap de pollo', description: 'Pollo a la plancha con verduras y salsa', price: 6.00, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=300&fit=crop', category: 'Wraps', isAvailable: true },
    { id: 'p5-3', storeId: 'store-5', name: 'Ensalada César', description: 'Lechuga, pollo, parmesano y salsa césar', price: 7.50, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&h=300&fit=crop', category: 'Ensaladas', isAvailable: true, isPopular: true },
    { id: 'p5-4', storeId: 'store-5', name: 'Sandwich vegetal', description: 'Huevo, lechuga, tomate y atún', price: 5.50, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop', category: 'Sandwiches', isAvailable: true },
    { id: 'p5-5', storeId: 'store-5', name: 'Patatas bravas', description: 'Patatas fritas con salsa brava casera', price: 4.00, image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=300&h=300&fit=crop', category: 'Extras', isAvailable: true },
    { id: 'p5-6', storeId: 'store-5', name: 'Bebida refrescante', description: 'Refresco a elegir', price: 2.00, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop', category: 'Bebidas', isAvailable: true },
  ],
};

// Merge products into stores
export const getStoresWithProducts = (): Store[] => {
  return mockStores.map(store => ({
    ...store,
    products: mockProducts[store.id] || [],
  }));
};

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    storeId: 'store-1',
    userId: 'user-2',
    userName: 'María García',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    comment: '¡El mejor pan de la zona! Los croissants son increíbles, siempre frescos y crujientes.',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'review-2',
    storeId: 'store-1',
    userId: 'user-3',
    userName: 'Carlos López',
    rating: 4,
    comment: 'Muy buena calidad de productos. El café también está muy rico.',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'review-3',
    storeId: 'store-2',
    userId: 'user-4',
    userName: 'Ana Martínez',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Los mejores helados artesanales. El de chocolate es espectacular.',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'review-4',
    storeId: 'store-3',
    userId: 'user-5',
    userName: 'Pedro Sánchez',
    rating: 4,
    comment: 'Café de especialidad muy bueno. Ambiente agradable para trabajar.',
    createdAt: new Date('2024-01-12'),
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'order_status',
    title: 'Pedido en preparación',
    message: 'Tu pedido de Panadería La Espiga está siendo preparado',
    isRead: false,
    createdAt: new Date(),
    data: { orderId: 'order-1', storeId: 'store-1' },
  },
  {
    id: 'notif-2',
    type: 'promotion',
    title: '🎉 ¡Oferta especial!',
    message: 'Heladería Polar: 2x1 en helados este fin de semana',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
    data: { storeId: 'store-2' },
  },
  {
    id: 'notif-3',
    type: 'news',
    title: 'Nuevo comercio disponible',
    message: 'Frutería Natural ya está disponible en ParkEat',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
  },
];

// Mock order history
export const mockOrderHistory: Order[] = [
  {
    id: 'order-hist-1',
    storeId: 'store-1',
    storeName: 'Panadería La Espiga',
    storeImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    items: [
      { product: mockProducts['store-1'][0], quantity: 2 },
      { product: mockProducts['store-1'][1], quantity: 1 },
    ],
    status: 'delivered',
    subtotal: 5.20,
    serviceFee: 0.50,
    total: 5.70,
    tableCode: 'MESA-A3',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'order-hist-2',
    storeId: 'store-2',
    storeName: 'Heladería Polar',
    storeImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=400&fit=crop',
    items: [
      { product: mockProducts['store-2'][0], quantity: 2 },
      { product: mockProducts['store-2'][3], quantity: 1 },
    ],
    status: 'delivered',
    subtotal: 12.90,
    serviceFee: 1.00,
    total: 13.90,
    tableCode: 'MESA-B5',
    paymentMethod: 'bizum',
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
];

// Demo users for authentication
export const demoUsers = [
  {
    id: 'user-1',
    username: 'paco',
    password: '12345',
    email: 'paco@example.com',
    name: 'Paco García',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    phone: '+34 612 345 678',
  },
];

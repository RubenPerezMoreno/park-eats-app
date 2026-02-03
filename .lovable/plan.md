

# 🍽️ ParkEat - Aplicación Móvil Completa

## Visión General
Aplicación móvil profesional para pedir comida en parques desde comercios locales cercanos, escaneando códigos QR en mesas y recibiendo el pedido directamente.

---

## 📱 Flujo Principal de la Aplicación

### 1. Pantalla de Bienvenida y Onboarding
- Splash screen con logo de ParkEat y animación suave
- Carrusel de introducción explicando el concepto (3 slides)
- Estilo moderno y minimalista con colores claros

### 2. Sistema de Autenticación
- **Pantalla de Login** con usuario y contraseña
- **Pantalla de Registro** para nuevos usuarios
- Usuario de demostración precargado: paco / 12345
- Validación de formularios y mensajes de error claros

### 3. Permisos de Ubicación
- Pantalla dedicada solicitando permiso de geolocalización
- Explicación de por qué es necesario (para encontrar comercios cercanos)
- Opción de continuar sin ubicación (funcionalidad limitada)

### 4. Pantalla Principal - Lista de Comercios
- Lista de comercios locales ordenados por cercanía
- Cada comercio muestra:
  - Foto de perfil del negocio
  - Nombre del comercio
  - Tipo de productos (panadería, cafetería, heladería, etc.)
  - Distancia en metros/kilómetros
  - Valoración con estrellas
  - Tiempo estimado de entrega
- Filtros por categoría de productos
- Barra de búsqueda

### 5. Mapa Interactivo
- Mapa con tu ubicación actual (marcador azul)
- Marcadores de comercios cercanos con iconos personalizados
- Al tocar un marcador, muestra tarjeta resumen del comercio
- Opción de ver ruta hasta el comercio

### 6. Detalle del Comercio
- Banner/foto del establecimiento
- Información completa (horario, descripción, valoraciones)
- Menú de productos organizado por categorías
- Cada producto con:
  - Imagen
  - Nombre y descripción
  - Precio
  - Botón para añadir al carrito con selector de cantidad

### 7. Carrito de Compra
- Lista de productos seleccionados
- Controles para modificar cantidad
- Cálculo de subtotal, gastos de servicio y total
- Opción de añadir notas al pedido
- Campo para código QR de la mesa (simular escaneo)

### 8. Proceso de Pago
- Múltiples métodos de pago simulados:
  - Tarjeta de crédito/débito
  - Bizum
  - Apple Pay / Google Pay
  - Pago en efectivo al recibir
- Resumen del pedido antes de confirmar
- Confirmación de pago con animación de éxito

### 9. Seguimiento del Pedido
- Estado del pedido en tiempo real (simulado):
  - Pedido recibido
  - En preparación
  - En camino
  - Entregado
- Tiempo estimado de llegada
- Notificaciones de cambio de estado

---

## ⭐ Funcionalidades Adicionales

### Historial de Pedidos
- Lista cronológica de pedidos anteriores
- Detalle de cada pedido con productos y total
- Opción "Repetir pedido" con un toque
- Estado de cada pedido (completado, cancelado)

### Sistema de Reseñas
- Valorar comercios con estrellas (1-5)
- Escribir comentarios sobre la experiencia
- Ver reseñas de otros usuarios
- Fotos en las reseñas

### Notificaciones
- Centro de notificaciones en la app
- Alertas simuladas de:
  - Estado del pedido
  - Ofertas especiales de comercios favoritos
  - Novedades de la app

### Perfil de Usuario
- Foto de perfil y datos personales
- Direcciones guardadas
- Métodos de pago guardados
- Preferencias de notificaciones
- Cerrar sesión

---

## 🎨 Diseño y Experiencia

- **Estilo**: Moderno y minimalista
- **Colores**: Paleta clara con acentos verdes (referencia a parques)
- **Tipografía**: Limpia y legible
- **Navegación**: Tab bar inferior con iconos (Inicio, Mapa, Pedidos, Perfil)
- **Animaciones**: Transiciones suaves entre pantallas
- **Responsive**: Optimizado para móvil con aspecto de app nativa

---

## 📊 Datos de Demostración

Se incluirán comercios ficticios para la demo:
- **Panadería La Espiga** (150m) - Pan, bollería, café
- **Heladería Polar** (230m) - Helados artesanales
- **Cafetería El Roble** (340m) - Café, zumos, snacks
- **Frutería Natural** (420m) - Fruta fresca, smoothies
- **Bocatería Parque** (510m) - Bocadillos, ensaladas

Cada uno con menú completo de productos, imágenes y precios.


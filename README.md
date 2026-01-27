# 🛒 Ecommerce MERN Stack

Plataforma de comercio electrónico completa construida con el stack MERN (MongoDB, Express, React, Node.js), Redux para gestión de estado y Tailwind CSS para estilos.

## 🚀 Tecnologías

### Backend
- **Node.js** & **Express.js** - Servidor y API REST
- **MongoDB** & **Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación y autorización
- **Bcrypt** - Encriptación de contraseñas
- **Cloudinary** - Almacenamiento de imágenes
- **Stripe** - Procesamiento de pagos
- **Resend** - Emails transaccionales
- **PDFKit** - Generación de facturas PDF
- **Jest** & **Supertest** - Testing

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool y dev server
- **Redux** - Gestión de estado global
- **React Router** - Navegación
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Toastify** - Notificaciones

## 📋 Prerequisitos

- Node.js (v18 o superior)
- MongoDB Atlas account o MongoDB local
- npm o yarn
- Cuentas en: Cloudinary, Stripe, Resend

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ecommerce-mern
```

### 2. Configurar Backend

```bash
cd server
npm install
```

#### Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp server/config/index.env.example server/config/index.env
```

Edita `server/config/index.env` con tus datos:

```env
PORT=5000
NODE_ENV=production

# MongoDB Atlas
MONGO_URL=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret (genera uno seguro)
JWT_SECRET=tu_clave_secreta_muy_segura_de_al_menos_32_caracteres

# Cloudinary (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Stripe (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Resend (https://resend.com/api-keys)
RESEND_API_KEY=re_tu_api_key
```

### 3. Configurar Frontend

```bash
cd ../client
npm install
```

## 🧪 Testing

El proyecto incluye tests con Jest y Supertest:

```bash
cd server

# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 🚀 Ejecutar el Proyecto

### Desarrollo

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Producción

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
# Servir archivos desde /client/dist
```

## 📁 Estructura del Proyecto

```
ecommerce-mern/
├── server/                 # Backend
│   ├── config/
│   │   ├── db.js          # Configuración MongoDB
│   │   └── index.env      # Variables de entorno
│   ├── middleware/
│   │   ├── auth.js        # Middleware de autenticación
│   │   ├── adminAuth.js   # Middleware de admin
│   │   ├── productById.js
│   │   └── categoryById.js
│   ├── models/
│   │   ├── User.js        # Modelo de usuario
│   │   ├── Product.js     # Modelo de producto
│   │   └── Category.js    # Modelo de categoría
│   ├── routes/
│   │   ├── auth.route.js  # Rutas de autenticación
│   │   ├── product.route.js
│   │   └── category.route.js
│   ├── package.json
│   └── server.js          # Punto de entrada
│
├── client/                # Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── buttons/
│   │   │   ├── container/
│   │   │   ├── inputs/
│   │   │   └── navbar/
│   │   ├── data/          # Redux
│   │   │   ├── reducers/
│   │   │   │   ├── auth.js
│   │   │   │   └── index.js
│   │   │   └── store.js
│   │   ├── helpers/       # Utilidades
│   │   │   ├── setAuthToken.js
│   │   │   └── URL.js
│   │   ├── screens/       # Páginas
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── routes.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔧 Funcionalidades

### Implementadas
- ✅ Registro y login de usuarios
- ✅ Autenticación con JWT
- ✅ Gestión de categorías (CRUD)
- ✅ Gestión de productos (CRUD)
- ✅ Carga de imágenes con Cloudinary
- ✅ Filtrado y búsqueda de productos
- ✅ Panel de administrador completo
- ✅ Roles de usuario (User/Admin)
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Sistema de descuentos y ofertas
- ✅ Editor de texto enriquecido (TipTap)
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Integración con Stripe (Tarjeta, PayPal, Revolut Pay)
- ✅ Sistema de cupones de descuento
- ✅ Gestión de pedidos
- ✅ Notificaciones en tiempo real
- ✅ Facturas PDF descargables
- ✅ Emails transaccionales (confirmación, envío, etc.)
- ✅ Sistema de devoluciones (RMA)
- ✅ Panel de usuario con historial
- ✅ Gestión de favoritos
- ✅ Productos vistos recientemente
- ✅ Recomendaciones personalizadas
- ✅ Analíticas de ventas

### Próximas Mejoras
- ⏳ Sistema de reviews con imágenes
- ⏳ Chat de soporte en vivo
- ⏳ Notificaciones push
- ⏳ Multi-idioma
- ⏳ Modo oscuro

## 📡 API Endpoints

### Autenticación
- `POST /api/user/register` - Registrar nuevo usuario
- `POST /api/user/login` - Login de usuario
- `GET /api/user` - Obtener información del usuario (Privado)

### Categorías
- `POST /api/category` - Crear categoría (Admin)
- `GET /api/category/all` - Obtener todas las categorías
- `GET /api/category/:categoryId` - Obtener categoría por ID
- `PUT /api/category/:categoryId` - Actualizar categoría (Admin)
- `DELETE /api/category/:categoryId` - Eliminar categoría (Admin)

### Marcas
- `POST /api/brand` - Crear marca (Admin)
- `GET /api/brand/all` - Obtener todas las marcas
- `GET /api/brand/:brandId` - Obtener marca por ID
- `PUT /api/brand/:brandId` - Actualizar marca (Admin)
- `DELETE /api/brand/:brandId` - Eliminar marca (Admin)

### Productos
- `POST /api/product` - Crear producto (Admin)
- `GET /api/product/list` - Listar productos con filtros
- `GET /api/product/:productId` - Obtener producto por ID
- `GET /api/product/featured` - Productos destacados
- `GET /api/product/search` - Buscar productos
- `PUT /api/product/:productId` - Actualizar producto (Admin)
- `DELETE /api/product/:productId` - Eliminar producto (Admin)

### Pedidos
- `POST /api/order` - Crear pedido (Privado)
- `GET /api/order/user` - Pedidos del usuario (Privado)
- `GET /api/order/:orderId` - Detalle de pedido (Privado)
- `GET /api/order/:orderId/invoice` - Descargar factura PDF (Privado)
- `PUT /api/order/:orderId/status` - Actualizar estado (Admin)

### Devoluciones
- `POST /api/returns` - Solicitar devolución (Privado)
- `GET /api/returns/user` - Devoluciones del usuario (Privado)
- `GET /api/returns/:returnId` - Detalle de devolución (Privado)
- `GET /api/returns/admin/all` - Todas las devoluciones (Admin)
- `PUT /api/returns/admin/:returnId/status` - Actualizar estado (Admin)

### Stripe
- `POST /api/stripe/create-payment-intent` - Crear intento de pago (Privado)
- `POST /api/stripe/webhook` - Webhook de eventos de Stripe

### Cupones
- `POST /api/coupon` - Crear cupón (Admin)
- `POST /api/coupon/validate` - Validar cupón (Privado)
- `GET /api/coupon/all` - Listar cupones (Admin)
- `PUT /api/coupon/:couponId` - Actualizar cupón (Admin)
- `DELETE /api/coupon/:couponId` - Eliminar cupón (Admin)

## 🔐 Variables de Entorno

### Backend (server/config/index.env)
```env
PORT=5000

# MongoDB
MONGO_URL=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_clave_secreta_segura

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend (Emails)
RESEND_API_KEY=re_xxxxx

NODE_ENV=production
```

## 🎨 Personalización

### Colores en Tailwind
El color primario está definido en `client/tailwind.config.js`:
```js
colors: {
    primary: '#6F64F8',
}
```

## 🚀 Deployment

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables en tu servicio de hosting:

- `NODE_ENV=production`
- `MONGO_URL` - URL de MongoDB Atlas (producción)
- `JWT_SECRET` - Clave JWT segura (mínimo 32 caracteres)
- `CLOUDINARY_*` - Credenciales de Cloudinary
- `STRIPE_SECRET_KEY` - Clave de Stripe en modo live
- `STRIPE_WEBHOOK_SECRET` - Secret del webhook de Stripe
- `RESEND_API_KEY` - API key de Resend con dominio verificado

### Recomendaciones de Seguridad

1. **JWT Secret:** Genera una clave aleatoria fuerte
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **MongoDB:** Restringe IPs en Network Access a tu servidor

3. **CORS:** Configura origins específicos en producción

4. **Rate Limiting:** Ya configurado en el servidor

5. **Stripe Webhooks:** Configura el endpoint en dashboard de Stripe

## 🔧 Troubleshooting

### Error: "MongoDB Connection Error"

**Problema:** El servidor no puede conectarse a MongoDB Atlas

**Soluciones:**
1. ✅ Verifica que tu IP esté en la whitelist de MongoDB Atlas
   - Ve a Network Access → Add IP Address → Allow Access from Anywhere (desarrollo)

2. ✅ Verifica tu connection string en `server/config/index.env`
   - Asegúrate de reemplazar `<usuario>` y `<password>` con tus credenciales reales
   - Ejemplo: `mongodb+srv://admin:miPassword123@cluster0...`

3. ✅ Verifica que tu usuario de base de datos tenga permisos
   - Ve a Database Access en MongoDB Atlas
   - Asegúrate que el usuario tenga rol "Read and write to any database"

4. ✅ Revisa que el nombre de la base de datos sea correcto
   - En el connection string debe aparecer: `...mongodb.net/ecommerce?retryWrites=true...`

### Error: "EADDRINUSE: address already in use :::5000"

**Solución:** El puerto 5000 ya está en uso
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <número_del_proceso> /F

# Cambiar puerto en server/config/index.env
PORT=5001
```

### Error al registrar usuario: "User already exists"

**Solución:** El email ya está registrado, usa otro email o elimina el usuario existente desde MongoDB Atlas.

### Frontend no conecta con Backend

**Solución:** Verifica que:
1. El backend esté corriendo en puerto 5000
2. En `client/src/helpers/URL.js` la URL sea `http://localhost:5000`
3. No haya errores de CORS (ya configurado en el servidor)

## 📝 Notas Importantes

### Para Desarrollo:
- Los usuarios se crean con `role: 0` (usuario normal)
- Para crear un admin, usa el script: `node server/make-admin.js tu@email.com`
- El servidor usa `nodemon` para auto-reload en desarrollo

### Para Producción:
- Cambia `NODE_ENV=production` en variables de entorno
- Genera un JWT_SECRET seguro de 32+ caracteres
- Configura IPs específicas en MongoDB Atlas Network Access
- Verifica dominio en Resend para envío de emails
- Configura webhooks de Stripe con tu URL de producción
- Usa claves de Stripe en modo `live` (no `test`)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ usando MERN Stack**

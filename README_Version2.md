# Sistema de Catálogo y Reparaciones para Empresa de Electrodomésticos

Este proyecto es una aplicación web para una empresa de venta y reparación de electrodomésticos. Permite mostrar un catálogo de productos, gestionar solicitudes de reparación, administrar usuarios y productos, y está preparado para crecer con módulos de ventas, facturación e inventario.

---

## Tecnologías

- **Frontend:** Angular (TypeScript)
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB (Mongoose)
- **Almacenamiento de imágenes:** Cloudinary o S3
- **Autenticación:** JWT (jsonwebtoken)
- **Subida de archivos:** Multer
- **Validaciones:** express-validator
- **Email (opcional):** nodemailer
- **Logs:** morgan

---

## Progreso Inicial

Los siguientes comandos ya se han ejecutado para la estructura base:

### Backend

```sh
mkdir empresa-backend
cd empresa-backend
npm init -y
npm install express mongoose dotenv jsonwebtoken bcryptjs express-validator cors multer cloudinary nodemailer morgan
npm install --save-dev nodemon
mkdir src src/controllers src/models src/routes src/middlewares src/utils src/config
touch src/app.js .env
git init
```

### Frontend

```sh
npm install -g @angular/cli
ng new empresa-frontend
cd empresa-frontend
ng add @angular/material
npm install @auth0/angular-jwt ngx-toastr ngx-file-drop
```

---

## Estructura de Carpetas Sugerida

```
/empresa-backend
  /src
    /controllers
    /models
    /routes
    /middlewares
    /utils
    /config
    app.js
  .env
  package.json

/empresa-frontend
  /src
    /app
      /core
      /shared
      /auth
      /products
      /repairs
      /admin
      /contact
      /users
    environments
  angular.json
  package.json
```

---

## Funcionalidades Principales

### 1. Catálogo de Productos
- Listado público con filtros y paginación.
- Detalles de producto.
- CRUD de productos (admin).
- Gestión de imágenes (Cloudinary/S3).

### 2. Solicitudes de Reparación
- Formulario para crear solicitud (usuario/público).
- Listado e historial de solicitudes (usuario).
- Gestión de solicitudes y estados (admin).
- Notas internas (admin).

### 3. Usuarios y Autenticación
- Registro/login con JWT.
- Roles: usuario, admin.
- Gestión de usuarios (solo admin).

### 4. Contacto
- Formulario de contacto general.
- Envío de email de aviso (opcional).

### 5. Facturación y Ventas (Preparado para futuro)
- CRUD de ventas/pedidos.
- Generación de facturas (PDF).
- Panel de ventas.
- Inventario.

---

## Modelos Principales (MongoDB)

### Usuario
- nombre, email, password (hash), rol, fechaRegistro

### Producto
- nombre, descripción, categoría, precio, stock, imágenes [urls], activo, fechaCreacion

### Reparación
- productoId, usuarioId, descripcion, estado (pendiente, en curso, finalizada), fechaSolicitud, notas

### Factura (futuro)
- invoiceNumber, date, client, items, total, status, notes

### Mensaje de Contacto
- nombre, email, mensaje, fechaEnvio

---

## Endpoints REST Principales

| Método | Endpoint                   | Descripción                          |
|--------|----------------------------|--------------------------------------|
| POST   | /api/auth/login            | Login de usuario                     |
| GET    | /api/users                 | Listar usuarios (admin)              |
| POST   | /api/users                 | Crear usuario (admin)                |
| PUT    | /api/users/:id             | Editar usuario (admin)               |
| DELETE | /api/users/:id             | Eliminar usuario (admin)             |
| GET    | /api/products              | Listar productos (público)           |
| GET    | /api/products/:id          | Detalles de producto                 |
| POST   | /api/products              | Crear producto (admin)               |
| PUT    | /api/products/:id          | Editar producto (admin)              |
| DELETE | /api/products/:id          | Eliminar producto (admin)            |
| POST   | /api/products/:id/images   | Subir imagen (admin)                 |
| POST   | /api/repairs               | Crear solicitud reparación           |
| GET    | /api/repairs               | Listar reparaciones                  |
| GET    | /api/repairs/:id           | Detalle reparación                   |
| PUT    | /api/repairs/:id           | Actualizar estado/notas (admin)      |
| DELETE | /api/repairs/:id           | Eliminar solicitud (admin)           |
| POST   | /api/contact               | Enviar mensaje de contacto           |
| POST   | /api/invoices              | Crear factura                        |
| GET    | /api/invoices/:id/pdf      | Descargar factura en PDF             |

---

## Bibliotecas Utilizadas

### Backend
- express
- mongoose
- dotenv
- jsonwebtoken
- bcryptjs
- express-validator
- cors
- multer
- cloudinary
- nodemailer
- morgan
- nodemon (dev)

### Frontend
- @angular/core
- @angular/router
- @angular/forms
- @angular/material
- @auth0/angular-jwt
- ngx-toastr
- ngx-file-drop

---

## Proximos pasos recomendados

1. **Configura tu archivo `.env`** en el backend con las variables de entorno necesarias (MONGODB_URI, JWT_SECRET, CLOUDINARY, etc).
2. **Crea los modelos principales** en `/src/models/`.
3. **Define los endpoints iniciales** en `/src/routes/` y sus controladores.
4. **Implementa la autenticación y protección de rutas** con JWT y roles.
5. **Crea los módulos y servicios Angular** para consumir la API.
6. **Confirma que frontend y backend se comunican correctamente (CORS, rutas, etc).**
7. **Desarrolla primero el CRUD de productos**, luego el de reparaciones, luego usuarios y resto de funcionalidades.
8. **Haz commits frecuentes y sube el código a GitHub.**

---

## Notas

- El sistema está preparado para nuevas funcionalidades (ventas, facturación, inventario).
- El panel de administración es básico y seguro, solo para usuarios admin.
- El frontend Angular solo muestra el catálogo y la gestión de reparaciones por ahora.
- Usa esta documentación como base para Copilot Chat en VSCode, para que entienda el contexto si necesitas ayuda generando código.

---
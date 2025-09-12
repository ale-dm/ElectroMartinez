# API Catálogo: Productos, Categorías, Subcategorías y Marcas

## Endpoints principales


### Productos
- `GET    /api/products`           — Listar productos (filtros avanzados, ordenación, paginación)
- `GET    /api/products/:id`       — Detalle de producto
- `POST   /api/products`           — Crear producto (admin)
- `PUT    /api/products/:id`       — Editar producto (admin)
- `DELETE /api/products/:id`       — Eliminar producto (admin)
- `POST   /api/products/:id/images`— Subir imagen a producto (admin)

#### Filtros y parámetros soportados en `/api/products`

| Parámetro      | Tipo     | Descripción |
|--------------- |----------|-------------|
| nombre         | string   | Búsqueda por nombre (parcial, insensible a mayúsculas) |
| categoria      | id       | Filtrar por una categoría |
| categorias     | id[]     | Filtrar por varias categorías (separadas por coma) |
| subcategoria   | string   | Búsqueda parcial de subcategoría |
| marca          | id       | Filtrar por una marca |
| marcas         | id[]     | Filtrar por varias marcas (separadas por coma) |
| activo         | boolean  | Filtrar por estado activo/inactivo |
| precioMin      | number   | Precio mínimo |
| precioMax      | number   | Precio máximo |
| stockMin       | number   | Stock mínimo |
| stockMax       | number   | Stock máximo |
| sort           | string   | Ordenación: `sort=precio,-nombre` (ascendente/descendente) |
| page           | number   | Página actual (por defecto 1) |
| limit          | number   | Resultados por página (por defecto 10) |

#### Respuesta de listado de productos
```json
{
  "productos": [ /* array de productos */ ],
  "meta": {
    "total": 100,
    "totalPages": 10,
    "page": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Ejemplo de producto
```json
{
  "nombre": "Lavadora Samsung",
  "descripcion": "Lavadora de carga frontal 8kg",
  "categoria": "<ObjectId Categoria>",
  "subcategoria": "Carga frontal",
  "marca": "<ObjectId Marca>",
  "precio": 399.99,
  "stock": 10,
  "imagenes": ["url1", "url2"],
  "activo": true
}
```

### Categorías
- `GET    /api/categories`                 — Listar categorías (con subcategorías)
- `POST   /api/categories`                 — Crear categoría
- `PUT    /api/categories/:id`             — Editar categoría
- `DELETE /api/categories/:id`             — Eliminar categoría
- `POST   /api/categories/:id/subcategorias`   — Añadir subcategoría
- `DELETE /api/categories/:id/subcategorias`   — Eliminar subcategoría (body: `{ "subcatNombre": "nombre" }`)

#### Ejemplo de categoría
```json
{
  "nombre": "Electrodomésticos",
  "descripcion": "Productos para el hogar",
  "activa": true,
  "orden": 1,
  "subcategorias": [
    { "nombre": "Lavadoras", "descripcion": "", "activa": true, "orden": 1 }
  ]
}
```

### Marcas
- `GET    /api/brands`           — Listar marcas
- `GET    /api/brands/:id`       — Detalle de marca
- `POST   /api/brands`           — Crear marca
- `PUT    /api/brands/:id`       — Editar marca
- `DELETE /api/brands/:id`       — Eliminar marca (solo si no está en uso)

#### Ejemplo de marca
```json
{
  "nombre": "Samsung",
  "descripcion": "Electrónica y electrodomésticos",
  "activo": true,
  "orden": 1
}
```

## Notas
- Todos los endpoints de creación/edición/eliminación requieren autenticación y rol admin.
- Los productos referencian por ObjectId a categoría y marca.
- Las subcategorías están embebidas en la categoría.
- No se puede eliminar una marca si está asociada a productos.
- Validaciones y mensajes de error claros en todas las rutas.

---

¿Quieres ejemplos de peticiones (curl/Postman) o detalles de algún endpoint?

// import React from "react"; // No es necesario en React 17+

export type Product = {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: { _id: string; nombre: string } | string;
  marca: { _id: string; nombre: string } | string;
  imagenes: string[] | File[];
  activo: boolean;
};

type ProductTableProps = {
  products: Product[];
  loading: boolean;
  page: number;
  totalPages: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPageChange: (page: number) => void;
};

export default function ProductTable({ products, loading, page, totalPages, onEdit, onDelete, onPageChange }: ProductTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-brand-dark text-white">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2">Marca</th>
            <th className="px-4 py-2">Activo</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8} className="text-center py-8">Cargando...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={8} className="text-center py-8">No hay productos</td></tr>
          ) : (
            products.map(product => (
              <tr key={product._id} className="hover:bg-yellow-50">
                <td className="px-4 py-2 font-semibold">{product.nombre}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{product.descripcion}</td>
                <td className="px-4 py-2">${product.precio.toFixed(2)}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">{typeof product.categoria === 'string' ? product.categoria : product.categoria?.nombre}</td>
                <td className="px-4 py-2">{typeof product.marca === 'string' ? product.marca : product.marca?.nombre}</td>
                <td className="px-4 py-2">
                  <span className={product.activo ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{product.activo ? "Sí" : "No"}</span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => onEdit(product)} className="bg-brand-yellow text-brand-dark px-3 py-1 rounded font-bold shadow hover:bg-yellow-300 transition">Editar</button>
                  <button onClick={() => onDelete(product)} className="bg-red-500 text-white px-3 py-1 rounded font-bold shadow hover:bg-red-400 transition">Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="flex justify-between items-center p-4">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  );
}

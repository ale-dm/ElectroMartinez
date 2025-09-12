import React, { useState, useEffect } from "react";
import type { Product } from "./ProductTable";

export type Category = { _id: string; nombre: string };
export type Brand = { _id: string; nombre: string };

type ProductFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "_id"> & { _id?: string; imagenes: string[] | File[] }) => void;
  initialData?: Product | null;
  categories: Category[];
  brands: Brand[];
  loading: boolean;
};

export default function ProductForm({ open, onClose, onSubmit, initialData, categories, brands, loading }: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, "_id" | "imagenes"> & { imagenes: string[] | File[] }>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    marca: "",
    imagenes: [],
    activo: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, imagenes: [] });
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoria: "",
        marca: "",
        imagenes: [],
        activo: true,
      });
    }
    setError("");
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm(f => ({ ...f, imagenes: files }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.categoria || !form.marca) {
      setError("Nombre, precio, categoría y marca son obligatorios");
      return;
    }
    // Solo pasar los nombres de archivos si son strings, o los File[] si son nuevos
    onSubmit({ ...form, imagenes: form.imagenes, _id: initialData?._id });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg flex flex-col gap-5 border-2 border-brand-yellow/40 relative animate-fadeIn">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-3xl text-brand-yellow font-bold hover:text-yellow-500 focus:outline-none">×</button>
        <h2 className="text-2xl font-extrabold text-brand-dark mb-2 text-center tracking-tight">
          {initialData ? "Editar producto" : "Nuevo producto"}
        </h2>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-brand-dark">Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className="px-4 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition" required autoFocus />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-brand-dark">Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="px-4 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition" rows={2} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-semibold text-brand-dark">Precio *</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-lg text-brand-dark/70 font-bold">€</span>
              <input name="precio" type="number" min={0} value={form.precio} onChange={handleChange} className="pl-8 pr-2 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition w-full" required />
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-semibold text-brand-dark">Stock</label>
            <input name="stock" type="number" min={0} value={form.stock} onChange={handleChange} className="px-4 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-semibold text-brand-dark">Categoría *</label>
            <select name="categoria" value={form.categoria as string} onChange={handleChange} className="px-4 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition" required>
              <option value="">Selecciona</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-semibold text-brand-dark">Marca *</label>
            <select name="marca" value={form.marca as string} onChange={handleChange} className="px-4 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition" required>
              <option value="">Selecciona</option>
              {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-brand-dark">Imágenes</label>
          <input name="imagenes" type="file" multiple accept="image/*" onChange={handleFileChange} className="px-4 py-2 border-2 border-brand-yellow/30 rounded-lg focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow outline-none transition" />
        </div>
        <div className="flex items-center gap-2">
          <input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} className="accent-brand-yellow w-5 h-5" />
          <label className="font-semibold text-brand-dark">Activo</label>
        </div>
        {error && <div className="text-red-600 text-sm text-center font-semibold bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-dark to-brand-yellow text-white px-8 py-2 rounded-lg font-extrabold shadow-lg hover:from-brand-yellow hover:to-yellow-400 hover:text-brand-dark transition-all disabled:opacity-60 text-lg mt-2 border border-brand-dark/40">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-brand-yellow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              Guardando...
            </>
          ) : initialData ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Guardar cambios
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Crear producto
            </>
          )}
        </button>
      </form>
    </div>
  );
}

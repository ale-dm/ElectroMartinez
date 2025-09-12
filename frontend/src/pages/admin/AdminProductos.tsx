import { useEffect, useState } from "react";
import ProductTable from "../../components/ProductTable";
import type { Product } from "../../components/ProductTable";
import ProductForm from "../../components/ProductForm";
import type { Category, Brand } from "../../components/ProductForm";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productsService";
import { getCategories } from "../../services/categoriesService";
import { getBrands } from "../../services/brandsService";

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar productos
  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      const data = await getProducts(pageNum, 10, token);
      setProducts(data.productos);
      setTotalPages(data.meta.totalPages);
      setPage(data.meta.page);
    } catch (err: any) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías y marcas
  const fetchCategoriesBrands = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const cats = await getCategories(token);
      setCategories(cats);
      const brs = await getBrands(token);
      setBrands(brs);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesBrands();
  }, []);

  // Crear o editar producto
  const handleSubmit = async (data: any) => {
    setFormLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      if (editProduct) {
        await updateProduct(editProduct._id, data, token);
      } else {
        await createProduct(data, token);
      }
      setShowForm(false);
      setEditProduct(null);
      fetchProducts(page);
    } catch (err: any) {
      setError(err.message || "Error al guardar producto");
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (product: Product) => {
    if (!window.confirm(`¿Eliminar producto "${product.nombre}"?`)) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || "";
      await deleteProduct(product._id, token);
      fetchProducts(page);
    } catch (err: any) {
      setError(err.message || "Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear
  const handleNew = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  // Abrir modal para editar
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Gestión de productos</h1>
        <button onClick={handleNew} className="bg-brand-yellow text-brand-dark px-6 py-2 rounded font-bold shadow hover:bg-yellow-400 transition-all">Nuevo producto</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ProductTable
        products={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />
      <ProductForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditProduct(null); }}
        onSubmit={handleSubmit}
        initialData={editProduct}
        categories={categories}
        brands={brands}
        loading={formLoading}
      />
    </div>
  );
}

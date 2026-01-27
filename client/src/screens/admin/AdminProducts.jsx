import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { getProducts } from '../../data/reducers/product';
import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProducts = ({ getProducts, products, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
    
    // Estados para filtros
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        stock: 'all', // all, in-stock, low-stock, out-of-stock
        featured: 'all', // all, yes, no
        isActive: 'all' // all, active, inactive
    });

    useEffect(() => {
        getProducts();
        fetchCategories();
        fetchBrands();
    }, [getProducts]);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, products, filters]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/category/all`);
            setCategories(res.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/brand/all`);
            setBrands(res.data);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Filtro de búsqueda por texto
        if (searchTerm.trim()) {
            filtered = filtered.filter((product) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    product.name.toLowerCase().includes(searchLower) ||
                    (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
                    (product.description && product.description.toLowerCase().includes(searchLower)) ||
                    (product.brand && product.brand.toLowerCase().includes(searchLower))
                );
            });
        }

        // Filtro por categoría
        if (filters.category) {
            filtered = filtered.filter(p => p.category && p.category._id === filters.category);
        }

        // Filtro por marca
        if (filters.brand) {
            filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === filters.brand.toLowerCase());
        }

        // Filtro por stock
        if (filters.stock !== 'all') {
            if (filters.stock === 'in-stock') {
                filtered = filtered.filter(p => p.quantity > 10);
            } else if (filters.stock === 'low-stock') {
                filtered = filtered.filter(p => p.quantity > 0 && p.quantity <= 10);
            } else if (filters.stock === 'out-of-stock') {
                filtered = filtered.filter(p => p.quantity === 0);
            }
        }

        // Filtro por destacado
        if (filters.featured !== 'all') {
            filtered = filtered.filter(p => 
                filters.featured === 'yes' ? p.featured === true : p.featured !== true
            );
        }

        // Filtro por activo/inactivo
        if (filters.isActive !== 'all') {
            filtered = filtered.filter(p => 
                filters.isActive === 'active' ? p.isActive !== false : p.isActive === false
            );
        }

        setFilteredProducts(filtered);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            category: '',
            brand: '',
            stock: 'all',
            featured: 'all',
            isActive: 'all'
        });
    };

    const handleDelete = async (productId, productName) => {
        setDeleteModal({ isOpen: true, productId, productName });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${URLDevelopment}/api/product/${deleteModal.productId}`);
            toast.success('Producto eliminado correctamente');
            getProducts();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            toast.error('Error al eliminar el producto');
        }
    };

    if (loading) {
        return (
            <div className='flex'>
                <AdminSidebar />
                <div className='flex-1 p-8'>
                    <div className='text-center py-20'>
                        <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                            progress_activity
                        </span>
                        <p className='text-gray-600 mt-4 text-lg'>Cargando productos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex bg-gray-50 min-h-screen'>
            <AdminSidebar />
            
            <div className='flex-1 p-8'>
                <Breadcrumbs items={[
                    { label: 'Dashboard', href: '/dashboard/admin' },
                    { label: 'Productos' }
                ]} />
                
                <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-3xl font-bold text-secondary'>Gestión de Productos</h1>
                        <Link
                            to='/dashboard/admin/products/new'
                            className='bg-primary hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <span className='material-symbols-outlined'>add</span>
                            Nuevo Producto
                        </Link>
                    </div>

                    {/* Panel de Filtros */}
                    <div className='mb-6'>
                        <input
                            type='text'
                            placeholder='Buscar por nombre, SKU, descripción o marca...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                    </div>

                    {/* Filtros Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4'>
                            {/* Filtro por Categoría */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Categoría
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                >
                                    <option value=''>Todas</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.parent ? `  ↳ ${cat.name}` : cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por Marca */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Marca
                                </label>
                                <select
                                    value={filters.brand}
                                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                >
                                    <option value=''>Todas</option>
                                    {brands.map(brand => (
                                        <option key={brand._id} value={brand.name}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por Stock */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Stock
                                </label>
                                <select
                                    value={filters.stock}
                                    onChange={(e) => handleFilterChange('stock', e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                >
                                    <option value='all'>Todos</option>
                                    <option value='in-stock'>En stock (&gt;10)</option>
                                    <option value='low-stock'>Stock bajo (1-10)</option>
                                    <option value='out-of-stock'>Sin stock (0)</option>
                                </select>
                            </div>

                            {/* Filtro por Destacado */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Destacado
                                </label>
                                <select
                                    value={filters.featured}
                                    onChange={(e) => handleFilterChange('featured', e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                >
                                    <option value='all'>Todos</option>
                                    <option value='yes'>Sí</option>
                                    <option value='no'>No</option>
                                </select>
                            </div>

                            {/* Filtro por Estado */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Estado
                                </label>
                                <select
                                    value={filters.isActive}
                                    onChange={(e) => handleFilterChange('isActive', e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                >
                                    <option value='all'>Todos</option>
                                    <option value='active'>Activos</option>
                                    <option value='inactive'>Inactivos</option>
                                </select>
                            </div>
                        </div>

                        {/* Botón Limpiar Filtros */}
                        <div className='flex justify-between items-center mb-6'>
                            <p className='text-sm text-gray-600'>
                                Mostrando {filteredProducts.length} de {products.length} productos
                            </p>
                            <button
                                onClick={clearFilters}
                                className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                            >
                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                    filter_alt_off
                                </span>
                                Limpiar filtros
                            </button>
                        </div>

                    {/* Tabla de Productos */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full'>
                            <thead className='bg-secondary text-white'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Imagen</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Nombre</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Precio</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Stock</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Categoría</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Estado</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4'>
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className='w-16 h-16 object-cover rounded-lg'
                                                        />
                                                    ) : (
                                                        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center'>
                                                            <span className='material-symbols-outlined text-gray-400'>
                                                                inventory_2
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <div>
                                                            <p className='font-semibold text-secondary text-base'>{product.name}</p>
                                                            <p className='text-sm text-gray-600 truncate max-w-xs'>
                                                                {product.description}
                                                            </p>
                                                            {product.brand && (
                                                                <p className='text-xs text-gray-500 mt-1'>Marca: {product.brand}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 font-semibold text-primary text-base'>{product.price}€</td>
                                                <td className='px-6 py-4'>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        product.quantity > 10 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : product.quantity >= 5
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : product.quantity > 0
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.quantity} unid.
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4 text-gray-600'>
                                                    {product.category ? product.category.name : 'Sin categoría'}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    {product.featured && (
                                                        <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800'>
                                                            <span className='material-symbols-outlined' style={{fontSize: '16px'}}>star</span>
                                                            Destacado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <Link
                                                            to={`/producto/${product._id}`}
                                                            target='_blank'
                                                            className='p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors'
                                                            title='Ver en tienda'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                                                visibility
                                                            </span>
                                                        </Link>
                                                        <Link
                                                            to={`/dashboard/admin/products/edit/${product._id}`}
                                                            className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                                                            title='Editar'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                                                edit
                                                            </span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product._id, product.name)}
                                                            className='p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
                                                            title='Eliminar'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                                                delete
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                    {/* No Products */}
                    {!loading && filteredProducts.length === 0 && (
                        <div className='bg-white rounded-lg shadow-lg p-12 text-center'>
                            <span className='material-symbols-outlined text-gray-400' style={{fontSize: '80px'}}>
                                inventory_2
                            </span>
                            <p className='text-gray-600 mt-4 text-lg'>
                                {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
                            </p>
                            {!searchTerm && (
                                <Link
                                    to='/dashboard/admin/products/new'
                                    className='inline-block mt-6 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors'
                                >
                                    Crear Primer Producto
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal de confirmación */}
                <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                    onConfirm={confirmDelete}
                    title='¿Eliminar producto?'
                    message={`¿Estás seguro de que deseas eliminar "${deleteModal.productName}"? Esta acción no se puede deshacer.`}
                    confirmText='Sí, eliminar'
                    cancelText='Cancelar'
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    products: state.product.products,
    loading: state.product.loading
});

export default connect(mapStateToProps, { getProducts })(AdminProducts);

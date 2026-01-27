import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${URLDevelopment}/api/admin/stats`, {
                headers: { 'x-auth-token': token }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='flex min-h-screen bg-background'>
                <AdminSidebar />
                <main className='flex-1 p-8'>
                    <div className='text-center py-20'>
                        <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                            progress_activity
                        </span>
                        <p className='text-gray-600 mt-4'>Cargando estadísticas...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen bg-background'>
            <AdminSidebar />
            
            <main className='flex-1 p-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-secondary mb-2'>Dashboard</h1>
                    <p className='text-gray-600'>Resumen general de tu tienda</p>
                </div>

                {/* Tarjetas de Métricas */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    {/* Total Productos */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm mb-1'>Total Productos</p>
                                <p className='text-3xl font-bold text-secondary'>{stats?.totals.products || 0}</p>
                            </div>
                            <div className='bg-blue-100 p-4 rounded-full'>
                                <span className='material-symbols-outlined text-blue-600' style={{fontSize: '32px'}}>
                                    inventory_2
                                </span>
                            </div>
                        </div>
                        <Link to='/dashboard/admin/products' className='text-sm text-primary hover:underline mt-3 inline-block'>
                            Ver todos →
                        </Link>
                    </div>

                    {/* Total Categorías */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm mb-1'>Categorías</p>
                                <p className='text-3xl font-bold text-secondary'>{stats?.totals.categories || 0}</p>
                            </div>
                            <div className='bg-green-100 p-4 rounded-full'>
                                <span className='material-symbols-outlined text-green-600' style={{fontSize: '32px'}}>
                                    category
                                </span>
                            </div>
                        </div>
                        <Link to='/dashboard/admin/categories' className='text-sm text-primary hover:underline mt-3 inline-block'>
                            Gestionar →
                        </Link>
                    </div>

                    {/* Total Usuarios */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm mb-1'>Usuarios</p>
                                <p className='text-3xl font-bold text-secondary'>{stats?.totals.users || 0}</p>
                            </div>
                            <div className='bg-purple-100 p-4 rounded-full'>
                                <span className='material-symbols-outlined text-purple-600' style={{fontSize: '32px'}}>
                                    group
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Productos Destacados */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm mb-1'>Destacados</p>
                                <p className='text-3xl font-bold text-secondary'>{stats?.totals.featuredProducts || 0}</p>
                            </div>
                            <div className='bg-yellow-100 p-4 rounded-full'>
                                <span className='material-symbols-outlined text-yellow-600' style={{fontSize: '32px'}}>
                                    star
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas */}
                {(stats?.alerts.lowStock > 0 || stats?.alerts.outOfStock > 0 || stats?.alerts.withoutImages > 0) && (
                    <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
                        <h2 className='text-xl font-bold text-secondary mb-4 flex items-center gap-2'>
                            <span className='material-symbols-outlined text-orange-500'>warning</span>
                            Alertas
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {stats.alerts.lowStock > 0 && (
                                <div className='border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded'>
                                    <p className='font-semibold text-yellow-800'>Stock Bajo</p>
                                    <p className='text-2xl font-bold text-yellow-900'>{stats.alerts.lowStock}</p>
                                    <p className='text-sm text-yellow-700'>productos con menos de 5 unidades</p>
                                </div>
                            )}
                            {stats.alerts.outOfStock > 0 && (
                                <div className='border-l-4 border-red-500 bg-red-50 p-4 rounded'>
                                    <p className='font-semibold text-red-800'>Sin Stock</p>
                                    <p className='text-2xl font-bold text-red-900'>{stats.alerts.outOfStock}</p>
                                    <p className='text-sm text-red-700'>productos agotados</p>
                                </div>
                            )}
                            {stats.alerts.withoutImages > 0 && (
                                <div className='border-l-4 border-blue-500 bg-blue-50 p-4 rounded'>
                                    <p className='font-semibold text-blue-800'>Sin Imágenes</p>
                                    <p className='text-2xl font-bold text-blue-900'>{stats.alerts.withoutImages}</p>
                                    <p className='text-sm text-blue-700'>productos sin fotos</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Productos Recientes */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-secondary mb-4'>Últimos Productos</h2>
                        {stats?.recentProducts?.length > 0 ? (
                            <div className='space-y-4'>
                                {stats.recentProducts.map(product => (
                                    <div key={product._id} className='flex items-center gap-4 border-b pb-3 last:border-b-0'>
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
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2'>
                                                <p className='font-semibold text-secondary line-clamp-1'>{product.name}</p>
                                                {product.featured && (
                                                    <span className='material-symbols-outlined text-yellow-500 text-sm'>star</span>
                                                )}
                                            </div>
                                            <p className='text-sm text-gray-600'>{product.category?.name}</p>
                                            <p className='text-sm text-gray-500'>Stock: {product.quantity}</p>
                                        </div>
                                        <p className='font-bold text-primary'>{product.price}€</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500 text-center py-8'>No hay productos aún</p>
                        )}
                    </div>

                    {/* Productos con Stock Bajo */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <h2 className='text-xl font-bold text-secondary mb-4 flex items-center gap-2'>
                            <span className='material-symbols-outlined text-yellow-500'>inventory</span>
                            Stock Bajo
                        </h2>
                        {stats?.lowStockList?.length > 0 ? (
                            <div className='space-y-4'>
                                {stats.lowStockList.map(product => (
                                    <div key={product._id} className='flex items-center gap-4 border-b pb-3 last:border-b-0'>
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
                                        <div className='flex-1'>
                                            <p className='font-semibold text-secondary line-clamp-1'>{product.name}</p>
                                            <p className='text-sm text-gray-600'>{product.category?.name}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                            product.quantity === 0 
                                                ? 'bg-red-100 text-red-800' 
                                                : product.quantity < 3
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {product.quantity} unid.
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500 text-center py-8'>¡Todos los productos tienen stock suficiente!</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

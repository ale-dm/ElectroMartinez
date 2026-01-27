import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-primary text-secondary' : 'text-white hover:bg-dark';
    };

    const menuItems = [
        { path: '/dashboard/admin', icon: 'dashboard', label: 'Dashboard' },
        { path: '/dashboard/admin/analytics', icon: 'bar_chart', label: 'Análisis de Ventas' },
        { path: '/dashboard/admin/products', icon: 'inventory_2', label: 'Productos' },
        { path: '/dashboard/admin/categories', icon: 'category', label: 'Categorías' },
        { path: '/dashboard/admin/brands', icon: 'verified', label: 'Marcas' },
        { path: '/dashboard/admin/pedidos', icon: 'receipt_long', label: 'Pedidos' },
        { path: '/dashboard/admin/devoluciones', icon: 'package_2', label: 'Devoluciones' },
        { path: '/dashboard/admin/cupones', icon: 'sell', label: 'Cupones' }
    ];

    return (
        <aside className='w-64 bg-secondary min-h-screen p-6'>
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-primary'>Panel Admin</h2>
                <p className='text-gray-400 text-sm'>ElectroMartinez</p>
            </div>

            <nav>
                <ul className='space-y-2'>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)}`}
                            >
                                <span className='material-symbols-outlined' style={{fontSize: '24px'}}>
                                    {item.icon}
                                </span>
                                <span className='font-medium'>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className='mt-8 pt-8 border-t border-gray-600'>
                <Link
                    to='/'
                    className='flex items-center gap-3 px-4 py-3 text-white hover:bg-dark rounded-lg transition-colors'
                >
                    <span className='material-symbols-outlined' style={{fontSize: '24px'}}>
                        home
                    </span>
                    <span className='font-medium'>Volver a la tienda</span>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;

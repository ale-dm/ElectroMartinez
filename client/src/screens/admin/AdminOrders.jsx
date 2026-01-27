import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        paymentStatus: '',
        paymentMethod: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const res = await axios.get(`${URLDevelopment}/api/order`, config);
            setOrders(res.data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            toast.error('Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            await axios.put(
                `${URLDevelopment}/api/order/${orderId}/status`,
                { orderStatus: newStatus },
                config
            );
            toast.success('Estado actualizado correctamente');
            fetchOrders();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('Error al actualizar estado');
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const filteredOrders = orders.filter(order => {
        const matchSearch = order.orderNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          order.user?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          order.user?.email?.toLowerCase().includes(filters.search.toLowerCase());
        const matchStatus = !filters.status || order.orderStatus === filters.status;
        const matchPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
        const matchPaymentMethod = !filters.paymentMethod || order.paymentMethod === filters.paymentMethod;

        return matchSearch && matchStatus && matchPaymentStatus && matchPaymentMethod;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
            confirmado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmado' },
            procesando: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Procesando' },
            enviado: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Enviado' },
            entregado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Entregado' },
            cancelado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
        };
        const config = statusConfig[status] || statusConfig.pendiente;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const config = {
            pendiente: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pendiente' },
            pagado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagado' },
            rechazado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' }
        };
        const paymentConfig = config[status] || config.pendiente;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.text}`}>
                {paymentConfig.label}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        <p className='text-gray-600 mt-4 text-lg'>Cargando pedidos...</p>
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
                    { label: 'Pedidos' }
                ]} />

                <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-3xl font-bold text-secondary'>Gestión de Pedidos</h1>
                    </div>

                {/* Filtros */}
                <div className='mb-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Buscar
                            </label>
                            <input
                                type='text'
                                name='search'
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder='Número, cliente, email...'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Estado del Pedido
                            </label>
                            <select
                                name='status'
                                value={filters.status}
                                onChange={handleFilterChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            >
                                <option value=''>Todos</option>
                                <option value='pendiente'>Pendiente</option>
                                <option value='confirmado'>Confirmado</option>
                                <option value='procesando'>Procesando</option>
                                <option value='enviado'>Enviado</option>
                                <option value='entregado'>Entregado</option>
                                <option value='cancelado'>Cancelado</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Estado de Pago
                            </label>
                            <select
                                name='paymentStatus'
                                value={filters.paymentStatus}
                                onChange={handleFilterChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            >
                                <option value=''>Todos</option>
                                <option value='pendiente'>Pendiente</option>
                                <option value='pagado'>Pagado</option>
                                <option value='rechazado'>Rechazado</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Método de Pago
                            </label>
                            <select
                                name='paymentMethod'
                                value={filters.paymentMethod}
                                onChange={handleFilterChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            >
                                <option value=''>Todos</option>
                                <option value='transferencia'>Transferencia</option>
                                <option value='contrareembolso'>Contrareembolso</option>
                                <option value='tarjeta'>Tarjeta</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de pedidos */}
                <div className='overflow-x-auto'>
                    <table className='min-w-full'>
                            <thead className='bg-secondary text-white'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Pedido
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Cliente
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Fecha
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Total
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Pago
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Estado
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan='7' className='px-6 py-12 text-center text-gray-500'>
                                            No hay pedidos que coincidan con los filtros
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className='hover:bg-gray-50'>
                                            <td className='px-6 py-4'>
                                                <div>
                                                    <p className='font-semibold text-secondary text-base'>{order.orderNumber}</p>
                                                    <p className='text-sm text-gray-500 capitalize'>{order.paymentMethod}</p>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div>
                                                    <p className='font-medium text-base'>{order.user?.name || 'N/A'}</p>
                                                    <p className='text-xs text-gray-500'>{order.user?.email || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 text-sm text-gray-700'>
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <p className='font-semibold text-primary text-base'>{order.totalPrice.toFixed(2)}€</p>
                                                <p className='text-sm text-gray-500'>{order.items.length} productos</p>
                                            </td>
                                            <td className='px-6 py-4'>
                                                {getPaymentBadge(order.paymentStatus)}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className='px-3 py-1 border border-gray-300 rounded-lg text-sm focus:border-primary focus:outline-none'
                                                >
                                                    <option value='pendiente'>Pendiente</option>
                                                    <option value='confirmado'>Confirmado</option>
                                                    <option value='procesando'>Procesando</option>
                                                    <option value='enviado'>Enviado</option>
                                                    <option value='entregado'>Entregado</option>
                                                    <option value='cancelado'>Cancelado</option>
                                                </select>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <button
                                                    onClick={() => navigate(`/dashboard/admin/pedidos/${order._id}`)}
                                                    className='text-primary hover:text-yellow-600 font-semibold text-sm flex items-center gap-1'
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                        visibility
                                                    </span>
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;

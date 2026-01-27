import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const res = await axios.get(`${URLDevelopment}/api/order/${id}`, config);
            setOrder(res.data);
        } catch (error) {
            console.error('Error al cargar pedido:', error);
            toast.error('Error al cargar pedido');
            navigate('/dashboard/admin/pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            await axios.put(
                `${URLDevelopment}/api/order/${id}/status`,
                { orderStatus: newStatus },
                config
            );
            toast.success('Estado actualizado correctamente');
            fetchOrder();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('Error al actualizar estado');
        }
    };

    const handlePaymentStatusChange = async (newPaymentStatus) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            await axios.put(
                `${URLDevelopment}/api/order/${id}/payment`,
                { paymentStatus: newPaymentStatus },
                config
            );
            toast.success('Estado de pago actualizado');
            fetchOrder();
        } catch (error) {
            console.error('Error al actualizar pago:', error);
            toast.error('Error al actualizar pago');
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <span className='material-symbols-outlined animate-spin text-primary text-6xl'>
                        progress_activity
                    </span>
                    <p className='text-gray-600 mt-4'>Cargando pedido...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

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
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
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
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${paymentConfig.bg} ${paymentConfig.text}`}>
                {paymentConfig.label}
            </span>
        );
    };

    return (
        <div className='flex'>
            <AdminSidebar />
            <div className='flex-1 min-h-screen bg-gray-50 py-8'>
                <div className='max-w-7xl mx-auto px-4'>
                {/* Header */}
                <div className='mb-8'>
                    <button
                        onClick={() => navigate('/dashboard/admin/pedidos')}
                        className='text-primary hover:text-yellow-600 font-semibold mb-4 flex items-center gap-2'
                    >
                        <span className='material-symbols-outlined'>arrow_back</span>
                        Volver a Pedidos
                    </button>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-4xl font-bold text-secondary mb-2'>
                                Pedido {order.orderNumber}
                            </h1>
                            <p className='text-gray-600'>
                                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className='bg-gray-200 hover:bg-gray-300 text-secondary font-bold py-3 px-6 rounded-lg flex items-center gap-2'
                        >
                            <span className='material-symbols-outlined'>print</span>
                            Imprimir
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Información del pedido */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Estados */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                <span className='material-symbols-outlined'>settings</span>
                                Gestión del Pedido
                            </h2>

                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                                        Estado del Pedido
                                    </label>
                                    <div className='flex gap-3'>
                                        {getStatusBadge(order.orderStatus)}
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                        >
                                            <option value='pendiente'>Pendiente</option>
                                            <option value='confirmado'>Confirmado</option>
                                            <option value='procesando'>Procesando</option>
                                            <option value='enviado'>Enviado</option>
                                            <option value='entregado'>Entregado</option>
                                            <option value='cancelado'>Cancelado</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                                        Estado de Pago
                                    </label>
                                    <div className='flex gap-3'>
                                        {getPaymentBadge(order.paymentStatus)}
                                        <select
                                            value={order.paymentStatus}
                                            onChange={(e) => handlePaymentStatusChange(e.target.value)}
                                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                        >
                                            <option value='pendiente'>Pendiente</option>
                                            <option value='pagado'>Pagado</option>
                                            <option value='rechazado'>Rechazado</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <span className='material-symbols-outlined text-primary'>info</span>
                                    <span>Los cambios se guardan automáticamente</span>
                                </div>
                            </div>
                        </div>

                        {/* Productos */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                <span className='material-symbols-outlined'>inventory_2</span>
                                Productos ({order.items.length})
                            </h2>

                            <div className='space-y-4'>
                                {order.items.map((item, index) => (
                                    <div key={index} className='flex gap-4 pb-4 border-b border-gray-200 last:border-0'>
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='w-20 h-20 object-cover rounded-lg'
                                            />
                                        ) : (
                                            <div className='w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                <span className='material-symbols-outlined text-gray-400'>
                                                    inventory_2
                                                </span>
                                            </div>
                                        )}
                                        <div className='flex-1'>
                                            <h3 className='font-semibold text-secondary'>{item.name}</h3>
                                            <p className='text-sm text-gray-600 mt-1'>
                                                Cantidad: {item.quantity} x {item.price.toFixed(2)}€
                                            </p>
                                            <p className='text-lg font-bold text-primary mt-2'>
                                                {(item.quantity * item.price).toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cliente y Envío */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                <span className='material-symbols-outlined'>person</span>
                                Información del Cliente
                            </h2>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <h3 className='font-semibold text-gray-700 mb-2'>Datos del Cliente</h3>
                                    <div className='space-y-2 text-sm'>
                                        <p><span className='font-medium'>Nombre:</span> {order.user?.name || 'N/A'}</p>
                                        <p><span className='font-medium'>Email:</span> {order.user?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className='font-semibold text-gray-700 mb-2'>Dirección de Envío</h3>
                                    <div className='space-y-1 text-sm'>
                                        <p className='font-medium'>{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p className='mt-2'>
                                            <span className='material-symbols-outlined text-xs align-middle'>call</span> {order.shippingAddress.phone}
                                        </p>
                                        <p>
                                            <span className='material-symbols-outlined text-xs align-middle'>mail</span> {order.shippingAddress.email}
                                        </p>
                                        {order.shippingAddress.notes && (
                                            <p className='mt-2 text-gray-600'>
                                                <span className='font-medium'>Notas:</span> {order.shippingAddress.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen lateral */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-lg shadow-lg p-6 sticky top-4'>
                            <h2 className='text-2xl font-bold text-secondary mb-6'>
                                Resumen
                            </h2>

                            {/* Método de pago */}
                            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                                <h3 className='font-semibold text-gray-700 mb-2'>Método de Pago</h3>
                                <p className='text-sm capitalize'>
                                    {order.paymentMethod === 'transferencia' && '🏦 Transferencia Bancaria'}
                                    {order.paymentMethod === 'contrareembolso' && '💵 Contrareembolso'}
                                    {order.paymentMethod === 'tarjeta' && '💳 Tarjeta de Crédito/Débito'}
                                </p>
                                {order.stripePaymentMethodId && (
                                    <p className='text-xs text-gray-500 mt-1'>
                                        Stripe: {order.stripePaymentMethodId.substring(0, 20)}...
                                    </p>
                                )}
                            </div>

                            {/* Precios */}
                            <div className='space-y-3 mb-6'>
                                <div className='flex justify-between text-gray-700'>
                                    <span>Subtotal</span>
                                    <span className='font-semibold'>{order.itemsPrice.toFixed(2)}€</span>
                                </div>
                                <div className='flex justify-between text-gray-700'>
                                    <span>IVA (21%)</span>
                                    <span className='font-semibold'>{order.taxPrice.toFixed(2)}€</span>
                                </div>
                                <div className='flex justify-between text-gray-700'>
                                    <span>Envío</span>
                                    <span className='font-semibold text-green-600'>
                                        {order.shippingPrice === 0 ? 'GRATIS' : `${order.shippingPrice.toFixed(2)}€`}
                                    </span>
                                </div>
                                <div className='border-t border-gray-200 pt-3'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xl font-bold text-secondary'>Total</span>
                                        <span className='text-3xl font-bold text-primary'>{order.totalPrice.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className='border-t border-gray-200 pt-6 space-y-3'>
                                <div className='flex items-start gap-2 text-sm'>
                                    <span className='material-symbols-outlined text-gray-400' style={{fontSize: '20px'}}>
                                        calendar_today
                                    </span>
                                    <div>
                                        <p className='font-medium text-gray-700'>Fecha de Pedido</p>
                                        <p className='text-gray-600'>
                                            {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>

                                {order.deliveredAt && (
                                    <div className='flex items-start gap-2 text-sm'>
                                        <span className='material-symbols-outlined text-green-600' style={{fontSize: '20px'}}>
                                            check_circle
                                        </span>
                                        <div>
                                            <p className='font-medium text-gray-700'>Fecha de Entrega</p>
                                            <p className='text-gray-600'>
                                                {new Date(order.deliveredAt).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {order.trackingNumber && (
                                    <div className='flex items-start gap-2 text-sm'>
                                        <span className='material-symbols-outlined text-blue-600' style={{fontSize: '20px'}}>
                                            local_shipping
                                        </span>
                                        <div>
                                            <p className='font-medium text-gray-700'>Nº de Seguimiento</p>
                                            <p className='text-gray-600 font-mono'>{order.trackingNumber}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminOrderDetail;

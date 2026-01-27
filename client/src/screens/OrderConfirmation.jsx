import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Container from '../components/container/Container';
import { URLDevelopment } from '../helpers/URL';
import { clearCart } from '../data/reducers/cart';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

    // Obtener parámetros de Stripe
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
            return;
        }

        // Si viene de Stripe con pago exitoso
        if (paymentIntent && redirectStatus === 'succeeded') {
            setPaymentSuccess(true);
            setLoading(false);
            // Limpiar carrito
            dispatch(clearCart());
            return;
        }

        // Si tiene orderId válido, cargar el pedido
        if (orderId && orderId !== 'undefined') {
            const fetchOrder = async () => {
                try {
                    const config = {
                        headers: {
                            'x-auth-token': localStorage.getItem('token')
                        }
                    };

                    const res = await axios.get(`${URLDevelopment}/api/order/${orderId}`, config);
                    setOrder(res.data);
                } catch (error) {
                    console.error('Error al obtener pedido:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrder();
        } else if (!paymentSuccess) {
            // Si no hay orderId ni pago exitoso, redirigir al home
            setLoading(false);
        }
    }, [orderId, isAuth, navigate, paymentIntent, redirectStatus, dispatch]);

    if (loading) {
        return (
            <Container>
                <div className='min-h-screen py-12 flex items-center justify-center'>
                    <div className='text-center'>
                        <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                            progress_activity
                        </span>
                        <p className='text-gray-600 mt-4 text-lg'>Cargando pedido...</p>
                    </div>
                </div>
            </Container>
        );
    }

    // Mostrar confirmación de pago de Stripe (sin orderId)
    if (paymentSuccess && !order) {
        return (
            <Container>
                <div className='min-h-screen py-12'>
                    <div className='max-w-2xl mx-auto text-center'>
                        {/* Icono de éxito */}
                        <div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8'>
                            <span className='material-symbols-outlined text-green-600' style={{fontSize: '60px'}}>
                                check_circle
                            </span>
                        </div>

                        <h1 className='text-4xl font-bold text-secondary mb-4'>
                            ¡Pago Completado!
                        </h1>
                        
                        <p className='text-xl text-gray-600 mb-8'>
                            Tu pago se ha procesado correctamente. Recibirás un email de confirmación en breve.
                        </p>

                        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
                            <h2 className='text-lg font-bold text-secondary mb-4'>
                                Detalles del pago
                            </h2>
                            <div className='text-left space-y-2'>
                                <p className='text-gray-600'>
                                    <strong>ID de Pago:</strong> {paymentIntent}
                                </p>
                                <p className='text-gray-600'>
                                    <strong>Estado:</strong> <span className='text-green-600 font-semibold'>Completado</span>
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link
                                to='/dashboard/user'
                                className='bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                            >
                                Ver Mis Pedidos
                            </Link>
                            <Link
                                to='/shop'
                                className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors'
                            >
                                Seguir Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container>
                <div className='min-h-screen py-12 flex items-center justify-center'>
                    <div className='text-center'>
                        <span className='material-symbols-outlined text-red-400' style={{fontSize: '80px'}}>
                            error
                        </span>
                        <h2 className='text-3xl font-bold text-secondary mt-6 mb-4'>
                            Pedido no encontrado
                        </h2>
                        <Link
                            to='/shop'
                            className='inline-block bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                        >
                            Volver a la Tienda
                        </Link>
                    </div>
                </div>
            </Container>
        );
    }

    const getPaymentMethodText = (method) => {
        const methods = {
            'transferencia': 'Transferencia Bancaria',
            'contrareembolso': 'Contrareembolso',
            'tarjeta': 'Tarjeta de Crédito/Débito',
            'stripe': 'Tarjeta (Stripe)',
            'paypal': 'PayPal',
            'revolut_pay': 'Revolut Pay',
            'card': 'Tarjeta',
            'apple_pay': 'Apple Pay',
            'google_pay': 'Google Pay'
        };
        return methods[method] || method;
    };

    const handleDownloadInvoice = async () => {
        if (!order) return;
        setDownloadingInvoice(true);
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
                responseType: 'blob'
            };
            const res = await axios.get(`${URLDevelopment}/api/order/${order._id}/invoice`, config);
            
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura-${order.orderNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Factura descargada correctamente');
        } catch (error) {
            console.error('Error al descargar factura:', error);
            toast.error('Error al descargar la factura');
        } finally {
            setDownloadingInvoice(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'confirmado': 'bg-blue-100 text-blue-800',
            'procesando': 'bg-purple-100 text-purple-800',
            'enviado': 'bg-indigo-100 text-indigo-800',
            'entregado': 'bg-green-100 text-green-800',
            'cancelado': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Container>
            <div className='min-h-screen py-12'>
                {/* Header de confirmación */}
                <div className='bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-8 text-center'>
                    <div className='inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-4'>
                        <span className='material-symbols-outlined' style={{fontSize: '48px'}}>
                            check_circle
                        </span>
                    </div>
                    <h1 className='text-4xl font-bold text-secondary mb-2'>
                        ¡Pedido Realizado con Éxito!
                    </h1>
                    <p className='text-gray-700 text-lg mb-4'>
                        Gracias por tu compra. Tu pedido ha sido registrado correctamente.
                    </p>
                    <div className='inline-block bg-white px-6 py-3 rounded-lg shadow'>
                        <p className='text-sm text-gray-600 mb-1'>Número de Pedido</p>
                        <p className='text-2xl font-bold text-primary'>{order.orderNumber}</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Detalles del pedido */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Estado del pedido */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-4 flex items-center gap-2'>
                                <span className='material-symbols-outlined'>info</span>
                                Estado del Pedido
                            </h2>
                            <div className='flex items-center gap-3'>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus.toUpperCase()}
                                </span>
                                <span className='text-gray-600'>
                                    Pedido realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Productos */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-4 flex items-center gap-2'>
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
                                                Cantidad: {item.quantity}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                Precio unitario: {item.price.toFixed(2)}€
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-bold text-primary text-lg'>
                                                {(item.quantity * item.price).toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dirección de envío */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-4 flex items-center gap-2'>
                                <span className='material-symbols-outlined'>local_shipping</span>
                                Dirección de Envío
                            </h2>
                            <div className='text-gray-700 space-y-2'>
                                <p className='font-semibold'>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.postalCode} - {order.shippingAddress.city}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p className='flex items-center gap-2 mt-3'>
                                    <span className='material-symbols-outlined text-primary' style={{fontSize: '20px'}}>
                                        phone
                                    </span>
                                    {order.shippingAddress.phone}
                                </p>
                                <p className='flex items-center gap-2'>
                                    <span className='material-symbols-outlined text-primary' style={{fontSize: '20px'}}>
                                        email
                                    </span>
                                    {order.shippingAddress.email}
                                </p>
                                {order.shippingAddress.notes && (
                                    <div className='mt-4 p-3 bg-gray-50 rounded'>
                                        <p className='text-sm text-gray-600'>Notas:</p>
                                        <p className='text-sm'>{order.shippingAddress.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Método de pago */}
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-secondary mb-4 flex items-center gap-2'>
                                <span className='material-symbols-outlined'>payment</span>
                                Método de Pago
                            </h2>
                            <p className='text-gray-700 font-semibold'>
                                {getPaymentMethodText(order.paymentMethod)}
                            </p>
                            {order.paymentMethod === 'transferencia' && (
                                <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                                    <p className='font-semibold text-secondary mb-2'>
                                        Datos para realizar la transferencia:
                                    </p>
                                    <div className='space-y-1 text-sm text-gray-700'>
                                        <p><strong>Banco:</strong> Banco Ejemplo</p>
                                        <p><strong>Titular:</strong> ElectroMartinez S.L.</p>
                                        <p><strong>IBAN:</strong> ES00 0000 0000 0000 0000 0000</p>
                                        <p><strong>Concepto:</strong> {order.orderNumber}</p>
                                        <p className='mt-3 text-yellow-700'>
                                            ⚠️ <strong>Importante:</strong> Incluye el número de pedido en el concepto
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-lg shadow-lg p-6 sticky top-4'>
                            <h2 className='text-2xl font-bold text-secondary mb-6'>
                                Resumen
                            </h2>
                            
                            <div className='space-y-3 mb-6'>
                                <div className='flex justify-between text-gray-700'>
                                    <span>Subtotal</span>
                                    <span className='font-semibold'>{order.itemsPrice.toFixed(2)}€</span>
                                </div>
                                <div className='flex justify-between text-gray-700'>
                                    <span>IVA</span>
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
                                        <span className='text-3xl font-bold text-primary'>
                                            {order.totalPrice.toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Próximos pasos */}
                            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                                <h3 className='font-bold text-secondary mb-3'>Próximos pasos:</h3>
                                <ol className='space-y-2 text-sm text-gray-700'>
                                    <li className='flex items-start gap-2'>
                                        <span className='text-primary font-bold'>1.</span>
                                        <span>Recibirás un email de confirmación</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='text-primary font-bold'>2.</span>
                                        <span>Procesaremos tu pedido en 24h</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='text-primary font-bold'>3.</span>
                                        <span>Te enviaremos el número de seguimiento</span>
                                    </li>
                                    <li className='flex items-start gap-2'>
                                        <span className='text-primary font-bold'>4.</span>
                                        <span>Recibirás tu pedido en 24-48h</span>
                                    </li>
                                </ol>
                            </div>

                            {/* Botones */}
                            <div className='space-y-3'>
                                <Link
                                    to='/shop'
                                    className='block w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors'
                                >
                                    Seguir Comprando
                                </Link>
                                <button
                                    onClick={handleDownloadInvoice}
                                    disabled={downloadingInvoice}
                                    className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
                                >
                                    <span className='material-symbols-outlined'>
                                        {downloadingInvoice ? 'progress_activity' : 'description'}
                                    </span>
                                    {downloadingInvoice ? 'Descargando...' : 'Descargar Factura'}
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className='w-full bg-gray-200 hover:bg-gray-300 text-secondary font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'
                                >
                                    <span className='material-symbols-outlined'>print</span>
                                    Imprimir Pedido
                                </button>
                            </div>

                            {/* Ayuda */}
                            <div className='mt-6 pt-6 border-t border-gray-200 text-center'>
                                <p className='text-sm text-gray-600 mb-2'>
                                    ¿Necesitas ayuda?
                                </p>
                                <p className='text-sm font-semibold text-secondary'>
                                    info@electromartinez.com
                                </p>
                                <p className='text-sm font-semibold text-secondary'>
                                    +34 900 000 000
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default OrderConfirmation;

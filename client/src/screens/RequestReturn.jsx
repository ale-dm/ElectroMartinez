import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Container from '../components/container/Container';
import { URLDevelopment } from '../helpers/URL';

const RequestReturn = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { isAuthenticated } = useSelector(state => state.auth);
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const reasonOptions = [
        { value: 'defectuoso', label: 'Producto defectuoso' },
        { value: 'no_funciona', label: 'No funciona correctamente' },
        { value: 'diferente_al_pedido', label: 'Diferente al pedido' },
        { value: 'danado_en_envio', label: 'Dañado en envío' },
        { value: 'no_lo_quiero', label: 'Ya no lo quiero' },
        { value: 'otro', label: 'Otro motivo' }
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrder();
    }, [isAuthenticated, orderId, navigate]);

    const fetchOrder = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const res = await axios.get(`${URLDevelopment}/api/order/${orderId}`, config);
            setOrder(res.data);
            
            // Verificar que el pedido está entregado
            if (res.data.orderStatus !== 'entregado') {
                toast.error('Solo puedes devolver pedidos entregados');
                navigate('/dashboard/user');
            }
        } catch (error) {
            console.error('Error al cargar pedido:', error);
            toast.error('Error al cargar el pedido');
            navigate('/dashboard/user');
        } finally {
            setLoading(false);
        }
    };

    const handleItemToggle = (productId) => {
        setSelectedItems(prev => {
            const existing = prev.find(item => item.product === productId);
            if (existing) {
                return prev.filter(item => item.product !== productId);
            }
            const orderItem = order.items.find(item => item.product._id === productId || item.product === productId);
            return [...prev, { 
                product: productId, 
                quantity: orderItem.quantity,
                reason: reason
            }];
        });
    };

    const handleQuantityChange = (productId, quantity) => {
        setSelectedItems(prev => 
            prev.map(item => 
                item.product === productId 
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            toast.error('Selecciona al menos un producto para devolver');
            return;
        }

        if (!reason) {
            toast.error('Selecciona un motivo de devolución');
            return;
        }

        setSubmitting(true);

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };

            const itemsWithReason = selectedItems.map(item => ({
                ...item,
                reason: reason
            }));

            await axios.post(`${URLDevelopment}/api/returns`, {
                orderId,
                items: itemsWithReason,
                reason,
                description
            }, config);

            toast.success('Solicitud de devolución enviada correctamente');
            navigate('/dashboard/user');
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            const errorMsg = error.response?.data?.message || 'Error al enviar la solicitud';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <div className='min-h-screen flex items-center justify-center'>
                    <div className='text-center'>
                        <span className='material-symbols-outlined animate-spin text-primary text-6xl'>
                            progress_activity
                        </span>
                        <p className='text-gray-600 mt-4'>Cargando pedido...</p>
                    </div>
                </div>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container>
                <div className='min-h-screen flex items-center justify-center'>
                    <div className='text-center'>
                        <span className='material-symbols-outlined text-red-500 text-8xl'>error</span>
                        <h2 className='text-2xl font-bold text-secondary mt-4'>Pedido no encontrado</h2>
                        <Link to='/dashboard/user' className='text-primary hover:underline mt-4 inline-block'>
                            Volver a mi cuenta
                        </Link>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className='min-h-screen py-12'>
                {/* Breadcrumb */}
                <nav className='flex items-center gap-2 text-sm text-gray-600 mb-8'>
                    <Link to='/dashboard/user' className='hover:text-primary'>Mi Cuenta</Link>
                    <span className='material-symbols-outlined text-gray-400' style={{fontSize: '16px'}}>chevron_right</span>
                    <span className='text-secondary font-semibold'>Solicitar Devolución</span>
                </nav>

                <div className='max-w-3xl mx-auto'>
                    <div className='bg-white rounded-lg shadow-lg p-8'>
                        <div className='flex items-center gap-4 mb-8'>
                            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                                <span className='material-symbols-outlined text-purple-600 text-2xl'>package_2</span>
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-secondary'>Solicitar Devolución</h1>
                                <p className='text-gray-600'>Pedido {order.orderNumber}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Seleccionar productos */}
                            <div className='mb-8'>
                                <h2 className='text-lg font-bold text-secondary mb-4'>
                                    1. Selecciona los productos a devolver
                                </h2>
                                <div className='space-y-4'>
                                    {order.items.map((item) => {
                                        const productId = item.product._id || item.product;
                                        const isSelected = selectedItems.some(i => i.product === productId);
                                        const selectedItem = selectedItems.find(i => i.product === productId);
                                        
                                        return (
                                            <div 
                                                key={productId}
                                                className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                                                    isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handleItemToggle(productId)}
                                            >
                                                <div className='flex items-center gap-4'>
                                                    <input
                                                        type='checkbox'
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                        className='w-5 h-5 text-purple-600 rounded'
                                                    />
                                                    {item.image && (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className='w-16 h-16 object-cover rounded'
                                                        />
                                                    )}
                                                    <div className='flex-1'>
                                                        <h3 className='font-semibold text-secondary'>{item.name}</h3>
                                                        <p className='text-sm text-gray-600'>
                                                            Cantidad pedida: {item.quantity} | Precio: {item.price.toFixed(2)}€
                                                        </p>
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <div className='mt-4 pl-9' onClick={(e) => e.stopPropagation()}>
                                                        <label className='text-sm text-gray-600 block mb-1'>
                                                            Cantidad a devolver:
                                                        </label>
                                                        <input
                                                            type='number'
                                                            min='1'
                                                            max={item.quantity}
                                                            value={selectedItem?.quantity || 1}
                                                            onChange={(e) => handleQuantityChange(productId, parseInt(e.target.value))}
                                                            className='w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Motivo de devolución */}
                            <div className='mb-8'>
                                <h2 className='text-lg font-bold text-secondary mb-4'>
                                    2. Motivo de la devolución
                                </h2>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                >
                                    <option value=''>Selecciona un motivo</option>
                                    {reasonOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Descripción adicional */}
                            <div className='mb-8'>
                                <h2 className='text-lg font-bold text-secondary mb-4'>
                                    3. Descripción adicional (opcional)
                                </h2>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Describe el problema con más detalle...'
                                    rows='4'
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none'
                                />
                            </div>

                            {/* Información de política */}
                            <div className='bg-gray-50 rounded-lg p-4 mb-8'>
                                <h3 className='font-semibold text-secondary mb-2 flex items-center gap-2'>
                                    <span className='material-symbols-outlined text-gray-600'>info</span>
                                    Política de devoluciones
                                </h3>
                                <ul className='text-sm text-gray-600 space-y-1'>
                                    <li>• Tienes 30 días desde la entrega para solicitar una devolución</li>
                                    <li>• Los productos deben estar en su estado original</li>
                                    <li>• Recibirás instrucciones de envío una vez aprobada la devolución</li>
                                    <li>• El reembolso se procesará en 5-10 días hábiles</li>
                                </ul>
                            </div>

                            {/* Botones */}
                            <div className='flex gap-4'>
                                <Link
                                    to='/dashboard/user'
                                    className='flex-1 py-3 px-6 border border-gray-300 rounded-lg text-center text-gray-700 hover:bg-gray-50 transition-colors font-semibold'
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type='submit'
                                    disabled={submitting || selectedItems.length === 0}
                                    className='flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                >
                                    {submitting ? (
                                        <>
                                            <span className='material-symbols-outlined animate-spin'>progress_activity</span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <span className='material-symbols-outlined'>send</span>
                                            Enviar Solicitud
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default RequestReturn;

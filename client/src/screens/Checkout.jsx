import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { FaCcVisa, FaCcMastercard, FaApplePay, FaGooglePay, FaPaypal } from 'react-icons/fa';
import { SiRevolut } from 'react-icons/si';
import Container from '../components/container/Container';
import { selectCartItems, selectCartTotal, clearCart } from '../data/reducers/cart';
import { URLDevelopment } from '../helpers/URL';
import { STRIPE_PUBLISHABLE_KEY } from '../config/stripe';
import StripeCheckoutForm from '../components/StripeCheckoutForm';

// Inicializar Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartTotal);
    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [selectedPaymentType, setSelectedPaymentType] = useState(''); // 'card', 'paypal', 'revolut_pay', 'google_pay', 'apple_pay'
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'España',
        notes: '',
        paymentMethod: 'stripe'
    });

    const taxRate = 0.21; // IVA 21%
    const tax = (subtotal - couponDiscount) * taxRate;
    const shipping = 0; // Envío gratis
    const total = subtotal + tax + shipping - couponDiscount;

    // Crear Payment Intent cuando se selecciona un método de pago de Stripe
    useEffect(() => {
        if (selectedPaymentType && total > 0 && isAuth) {
            createPaymentIntent(selectedPaymentType);
        } else {
            // Limpiar clientSecret si se cambia de método de pago
            setClientSecret('');
        }
    }, [selectedPaymentType, total]);

    const createPaymentIntent = async (paymentMethodType) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `${URLDevelopment}/api/stripe/create-payment-intent`,
                {
                    amount: Math.round(total * 100), // Convertir a centavos
                    paymentMethodType: paymentMethodType
                },
                {
                    headers: { 'x-auth-token': token }
                }
            );
            
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            toast.error('Error al inicializar el pago');
            setClientSecret('');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleValidateCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Ingresa un código de cupón');
            return;
        }

        setValidatingCoupon(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${URLDevelopment}/api/coupon/validate`,
                {
                    code: couponCode,
                    subtotal: subtotal
                },
                {
                    headers: { 'x-auth-token': token }
                }
            );

            if (response.data.success) {
                setAppliedCoupon(response.data.coupon);
                setCouponDiscount(response.data.discountAmount);
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cupón inválido');
            setAppliedCoupon(null);
            setCouponDiscount(0);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
        toast.info('Cupón eliminado');
    };

    const validateForm = () => {
        const { fullName, email, phone, address, city, postalCode } = formData;

        if (!fullName.trim()) {
            toast.error('El nombre completo es obligatorio');
            return false;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            toast.error('Email inválido');
            return false;
        }
        if (!phone.trim()) {
            toast.error('El teléfono es obligatorio');
            return false;
        }
        if (!address.trim()) {
            toast.error('La dirección es obligatoria');
            return false;
        }
        if (!city.trim()) {
            toast.error('La ciudad es obligatoria');
            return false;
        }
        if (!postalCode.trim()) {
            toast.error('El código postal es obligatorio');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuth) {
            toast.error('Debes iniciar sesión para realizar un pedido');
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            toast.error('El carrito está vacío');
            navigate('/carrito');
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Si el método de pago es tarjeta, no procesar aquí
        // El formulario de Stripe manejará el pago
        if (formData.paymentMethod === 'tarjeta') {
            e.stopPropagation();
            return; // El StripeCheckoutForm manejará la lógica
        }

        // Para otros métodos de pago, crear pedido directamente
        await createOrder();
    };

    const createOrder = async (paymentMethodId = null) => {
        setLoading(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone,
                    email: formData.email,
                    notes: formData.notes
                },
                paymentMethod: formData.paymentMethod,
                stripePaymentMethodId: paymentMethodId, // ID del método de pago de Stripe si aplica
                couponCode: appliedCoupon?.code // Incluir código de cupón si está aplicado
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            const res = await axios.post(`${URLDevelopment}/api/order`, orderData, config);

            // Aplicar cupón si existe (incrementar contador de uso)
            if (appliedCoupon) {
                try {
                    await axios.post(
                        `${URLDevelopment}/api/coupon/apply/${appliedCoupon.code}`,
                        {},
                        config
                    );
                } catch (err) {
                    console.error('Error al aplicar cupón:', err);
                    // No detener el proceso si falla la aplicación del cupón
                }
            }

            // Limpiar carrito
            dispatch(clearCart());

            toast.success('¡Pedido realizado con éxito!');
            
            // Redirigir a página de confirmación
            navigate(`/pedido-confirmado/${res.data._id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Error al procesar el pedido';
            toast.error(errorMsg);
            throw error; // Propagar error para que Stripe lo maneje
        } finally {
            setLoading(false);
        }
    };

    // Handler para cuando el pago con Stripe es exitoso
    const handleStripeSuccess = async (paymentMethod) => {
        // Validar formulario antes de procesar pago
        if (!validateForm()) {
            throw new Error('Por favor completa todos los campos del formulario');
        }

        try {
            await createOrder(paymentMethod.id);
        } catch (error) {
            throw error;
        }
    };

    // Redirigir si el carrito está vacío
    if (items.length === 0) {
        return (
            <Container>
                <div className='min-h-screen py-12'>
                    <div className='text-center py-20'>
                        <span className='material-symbols-outlined text-gray-300' style={{fontSize: '120px'}}>
                            shopping_cart
                        </span>
                        <h2 className='text-3xl font-bold text-secondary mt-6 mb-4'>
                            Tu carrito está vacío
                        </h2>
                        <p className='text-gray-600 mb-8'>
                            Añade productos al carrito antes de proceder al checkout
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className='bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                        >
                            Ir a la Tienda
                        </button>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className='min-h-screen py-12'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-secondary mb-2 flex items-center gap-3'>
                        <span className='material-symbols-outlined' style={{fontSize: '40px'}}>shopping_bag</span>
                        Finalizar Pedido
                    </h1>
                    <p className='text-gray-600'>
                        Completa la información de envío para procesar tu pedido
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Formulario de envío */}
                        <div className='lg:col-span-2 space-y-6'>
                            {/* Datos personales */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                    <span className='material-symbols-outlined'>person</span>
                                    Datos Personales
                                </h2>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type='text'
                                            name='fullName'
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Email *
                                        </label>
                                        <input
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                            required
                                        />
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Teléfono *
                                        </label>
                                        <input
                                            type='tel'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='+34 600 000 000'
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dirección de envío */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                    <span className='material-symbols-outlined'>local_shipping</span>
                                    Dirección de Envío
                                </h2>
                                
                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Dirección *
                                        </label>
                                        <input
                                            type='text'
                                            name='address'
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder='Calle, número, piso, puerta...'
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                            required
                                        />
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Ciudad *
                                            </label>
                                            <input
                                                type='text'
                                                name='city'
                                                value={formData.city}
                                                onChange={handleChange}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Código Postal *
                                            </label>
                                            <input
                                                type='text'
                                                name='postalCode'
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                placeholder='28001'
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                País *
                                            </label>
                                            <input
                                                type='text'
                                                name='country'
                                                value={formData.country}
                                                onChange={handleChange}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none bg-gray-50'
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Notas adicionales (opcional)
                                        </label>
                                        <textarea
                                            name='notes'
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows='3'
                                            placeholder='Instrucciones de entrega, horarios preferidos, etc.'
                                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none'
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Método de pago */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                    <span className='material-symbols-outlined'>payment</span>
                                    Método de Pago
                                </h2>
                                
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {/* Tarjeta de Crédito/Débito */}
                                    <button
                                        type='button'
                                        onClick={() => setSelectedPaymentType('card')}
                                        className={`p-6 border-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-3 ${
                                            selectedPaymentType === 'card'
                                                ? 'border-primary bg-yellow-50 text-primary shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className='flex gap-2'>
                                            <FaCcVisa className='text-4xl text-blue-700' />
                                            <FaCcMastercard className='text-4xl text-orange-500' />
                                        </div>
                                        <span>Tarjeta</span>
                                    </button>

                                    {/* Apple Pay */}
                                    <button
                                        type='button'
                                        onClick={() => setSelectedPaymentType('apple_pay')}
                                        className={`p-6 border-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-3 ${
                                            selectedPaymentType === 'apple_pay'
                                                ? 'border-black bg-gray-100 text-black shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                                        }`}
                                    >
                                        <FaApplePay className='text-5xl text-black' />
                                        <span>Apple Pay</span>
                                    </button>

                                    {/* Google Pay */}
                                    <button
                                        type='button'
                                        onClick={() => setSelectedPaymentType('google_pay')}
                                        className={`p-6 border-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-3 ${
                                            selectedPaymentType === 'google_pay'
                                                ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                                        }`}
                                    >
                                        <FaGooglePay className='text-5xl' />
                                        <span>Google Pay</span>
                                    </button>

                                    {/* PayPal */}
                                    <button
                                        type='button'
                                        onClick={() => setSelectedPaymentType('paypal')}
                                        className={`p-6 border-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-3 ${
                                            selectedPaymentType === 'paypal'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                                        }`}
                                    >
                                        <FaPaypal className='text-5xl text-blue-600' />
                                        <span>PayPal</span>
                                    </button>

                                    {/* Revolut Pay */}
                                    <button
                                        type='button'
                                        onClick={() => setSelectedPaymentType('revolut_pay')}
                                        className={`p-6 border-2 rounded-lg font-semibold transition-all flex flex-col items-center justify-center gap-3 ${
                                            selectedPaymentType === 'revolut_pay'
                                                ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-sm'
                                        }`}
                                    >
                                        <SiRevolut className='text-5xl text-black' />
                                        <span>Revolut Pay</span>
                                    </button>
                                </div>

                                {/* Formulario de Stripe - Solo se muestra si hay clientSecret */}
                                {selectedPaymentType && clientSecret && (
                                    <div className='mt-6 p-6 bg-gray-50 rounded-lg'>
                                        <Elements 
                                            stripe={stripePromise} 
                                            options={{
                                                clientSecret,
                                                appearance: {
                                                    theme: 'stripe',
                                                    variables: {
                                                        colorPrimary: '#eab308',
                                                        colorBackground: '#ffffff',
                                                        colorText: '#2d2d2d',
                                                        colorDanger: '#ef4444',
                                                        fontFamily: 'system-ui, sans-serif',
                                                        borderRadius: '8px'
                                                    }
                                                },
                                                locale: 'es'
                                            }}
                                        >
                                            <StripeCheckoutForm
                                                amount={total}
                                                paymentMethodType={selectedPaymentType}
                                                clientSecret={clientSecret}
                                                onSuccess={handleStripeSuccess}
                                                onError={(error) => {
                                                    console.error('Error en Stripe:', error);
                                                }}
                                            />
                                        </Elements>
                                    </div>
                                )}

                                {selectedPaymentType && !clientSecret && (
                                    <div className='mt-6 p-6 bg-gray-50 rounded-lg flex items-center justify-center'>
                                        <span className='material-symbols-outlined animate-spin mr-2'>progress_activity</span>
                                        <span>Preparando método de pago...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resumen del pedido */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-lg shadow-lg p-6 sticky top-4'>
                                <h2 className='text-2xl font-bold text-secondary mb-6'>
                                    Resumen del Pedido
                                </h2>

                                {/* Productos */}
                                <div className='mb-6 max-h-60 overflow-y-auto'>
                                    {items.map((item) => (
                                        <div key={item._id} className='flex gap-3 mb-4 pb-4 border-b border-gray-200 last:border-0'>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className='w-16 h-16 object-cover rounded-lg'
                                                />
                                            ) : (
                                                <div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                    <span className='material-symbols-outlined text-gray-400 text-sm'>
                                                        inventory_2
                                                    </span>
                                                </div>
                                            )}
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-semibold text-sm truncate'>{item.name}</p>
                                                <p className='text-xs text-gray-600 mt-1'>
                                                    {item.quantity} x {item.price.toFixed(2)}€
                                                </p>
                                                <p className='text-sm font-bold text-primary mt-1'>
                                                    {(item.quantity * item.price).toFixed(2)}€
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Cupón de descuento */}
                                <div className='mb-6 p-4 bg-gradient-to-r from-primary/10 to-yellow-50 rounded-lg border border-primary/20'>
                                    <h3 className='text-sm font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined text-primary'>sell</span>
                                        ¿Tienes un cupón?
                                    </h3>
                                    
                                    {!appliedCoupon ? (
                                        <div className='flex gap-2'>
                                            <input
                                                type='text'
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder='Código de cupón'
                                                className='flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm'
                                            />
                                            <button
                                                type='button'
                                                onClick={handleValidateCoupon}
                                                disabled={validatingCoupon}
                                                className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                            >
                                                {validatingCoupon ? 'Validando...' : 'Aplicar'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='bg-white rounded-lg p-3 border border-green-500'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='material-symbols-outlined text-green-600 text-sm'>check_circle</span>
                                                    <span className='text-sm font-bold text-green-700'>
                                                        {appliedCoupon.code}
                                                    </span>
                                                </div>
                                                <button
                                                    type='button'
                                                    onClick={handleRemoveCoupon}
                                                    className='text-red-500 hover:text-red-700 transition-colors'
                                                >
                                                    <span className='material-symbols-outlined text-sm'>close</span>
                                                </button>
                                            </div>
                                            {appliedCoupon.description && (
                                                <p className='text-xs text-gray-600'>{appliedCoupon.description}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Totales */}
                                <div className='space-y-3 mb-6'>
                                    <div className='flex justify-between text-gray-700'>
                                        <span>Subtotal</span>
                                        <span className='font-semibold'>{subtotal.toFixed(2)}€</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className='flex justify-between text-green-600'>
                                            <span className='flex items-center gap-1'>
                                                <span className='material-symbols-outlined text-sm'>sell</span>
                                                Descuento
                                            </span>
                                            <span className='font-semibold'>-{couponDiscount.toFixed(2)}€</span>
                                        </div>
                                    )}
                                    <div className='flex justify-between text-gray-700'>
                                        <span>IVA (21%)</span>
                                        <span className='font-semibold'>{tax.toFixed(2)}€</span>
                                    </div>
                                    <div className='flex justify-between text-gray-700'>
                                        <span>Envío</span>
                                        <span className='font-semibold text-green-600'>GRATIS</span>
                                    </div>
                                    <div className='border-t border-gray-200 pt-3'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-xl font-bold text-secondary'>Total</span>
                                            <span className='text-3xl font-bold text-primary'>{total.toFixed(2)}€</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de confirmar - Solo se muestra si NO es pago con tarjeta (Stripe maneja su propio botón) */}
                                {formData.paymentMethod !== 'tarjeta' && (
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='w-full bg-primary hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {loading ? (
                                            <>
                                                <span className='material-symbols-outlined animate-spin'>progress_activity</span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <span className='material-symbols-outlined'>check_circle</span>
                                                Confirmar Pedido
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Info de seguridad */}
                                <div className='mt-6 pt-6 border-t border-gray-200 space-y-3'>
                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <span className='material-symbols-outlined text-green-600' style={{fontSize: '20px'}}>
                                            verified_user
                                        </span>
                                        <span>Transacción segura y protegida</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <span className='material-symbols-outlined text-blue-600' style={{fontSize: '20px'}}>
                                            local_shipping
                                        </span>
                                        <span>Envío gratis en 24-48h</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                        <span className='material-symbols-outlined text-primary' style={{fontSize: '20px'}}>
                                            autorenew
                                        </span>
                                        <span>Devolución fácil en 30 días</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { FaCcVisa, FaCcMastercard, FaApplePay, FaGooglePay, FaPaypal } from 'react-icons/fa';
import { SiRevolut } from 'react-icons/si';

const StripeCheckoutForm = ({ amount, paymentMethodType, onSuccess, onError, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    // Nombres legibles de los métodos de pago
    const paymentMethodNames = {
        'card': 'Tarjeta',
        'apple_pay': 'Apple Pay',
        'google_pay': 'Google Pay',
        'paypal': 'PayPal',
        'revolut_pay': 'Revolut Pay'
    };

    // Iconos de los métodos de pago
    const paymentMethodIcons = {
        'card': <div className='flex gap-2'><FaCcVisa className='text-3xl text-blue-700' /><FaCcMastercard className='text-3xl text-orange-500' /></div>,
        'apple_pay': <FaApplePay className='text-5xl text-black' />,
        'google_pay': <FaGooglePay className='text-5xl' />,
        'paypal': <FaPaypal className='text-5xl text-blue-600' />,
        'revolut_pay': <SiRevolut className='text-5xl text-black' />
    };

    // Para PayPal, Revolut, etc. - redirigir automáticamente cuando esté listo
    useEffect(() => {
        if (stripe && clientSecret && paymentMethodType !== 'card') {
            // No hacer nada automático, esperar al clic del botón
        }
    }, [stripe, clientSecret, paymentMethodType]);

    const handleSubmit = async () => {
        if (!stripe) {
            toast.error('Stripe aún no está listo');
            return;
        }
        
        setProcessing(true);

        try {
            const returnUrl = `${window.location.origin}/pedido-confirmado`;

            if (paymentMethodType === 'card') {
                // Para tarjeta, usar CardElement
                const cardElement = elements?.getElement(CardElement);
                
                if (!cardElement) {
                    throw new Error('No se encontró el elemento de tarjeta');
                }

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement
                    }
                });

                if (error) {
                    throw new Error(error.message);
                }

                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    await onSuccess({ id: paymentIntent.payment_method });
                    toast.success('¡Pago procesado con éxito!');
                }
            } else if (paymentMethodType === 'paypal') {
                // Para PayPal - redirigir con payment_method_data
                const { error } = await stripe.confirmPayPalPayment(clientSecret, {
                    payment_method_data: {
                        billing_details: {}
                    },
                    return_url: returnUrl
                });

                if (error) {
                    throw new Error(error.message);
                }
            } else if (paymentMethodType === 'revolut_pay') {
                // Para Revolut Pay - redirigir con payment_method_data
                const { error } = await stripe.confirmRevolutPayPayment(clientSecret, {
                    payment_method_data: {
                        billing_details: {}
                    },
                    return_url: returnUrl
                });

                if (error) {
                    throw new Error(error.message);
                }
            } else if (paymentMethodType === 'google_pay' || paymentMethodType === 'apple_pay') {
                // Apple Pay y Google Pay requieren el Payment Request Button nativo del navegador
                // que solo funciona en dispositivos compatibles (Safari para Apple Pay, Chrome para Google Pay)
                const methodName = paymentMethodNames[paymentMethodType];
                toast.warning(
                    `${methodName} solo está disponible en dispositivos compatibles. ` +
                    `Por favor, usa la opción de Tarjeta para completar tu pago.`,
                    { autoClose: 5000 }
                );
                setProcessing(false);
                return;
            }
        } catch (error) {
            toast.error(error.message || 'Error al procesar el pago');
            if (onError) {
                onError(error);
            }
            setProcessing(false);
        }
    };

    // Renderizar el elemento de pago apropiado
    const renderPaymentInput = () => {
        const methodName = paymentMethodNames[paymentMethodType] || paymentMethodType;
        
        if (paymentMethodType === 'card') {
            return (
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 mb-2'>
                        {paymentMethodIcons['card']}
                        <span className='font-semibold'>Datos de la tarjeta</span>
                    </div>
                    <div className='p-4 border border-gray-300 rounded-lg bg-white'>
                        <CardElement 
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        fontFamily: 'system-ui, sans-serif',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#ef4444',
                                    },
                                },
                                hidePostalCode: false
                            }}
                        />
                    </div>
                </div>
            );
        } else {
            // Para PayPal, Revolut, Apple Pay, Google Pay - solo mostrar icono y botón
            return (
                <div className='text-center py-8 space-y-4'>
                    <div className='flex items-center justify-center'>
                        {paymentMethodIcons[paymentMethodType]}
                    </div>
                    <p className='text-gray-600 text-lg'>
                        Pago seguro con <strong>{methodName}</strong>
                    </p>
                    <p className='text-sm text-gray-500'>
                        Al pulsar el botón serás redirigido a {methodName} para completar el pago.
                    </p>
                </div>
            );
        }
    };

    const methodName = paymentMethodNames[paymentMethodType] || 'Stripe';

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
    };

    return (
        <div className='space-y-4'>
            {renderPaymentInput()}

            <button
                type='button'
                onClick={handleClick}
                disabled={!stripe || processing}
                className='w-full bg-primary hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {processing ? (
                    <>
                        <span className='material-symbols-outlined animate-spin'>progress_activity</span>
                        Procesando...
                    </>
                ) : (
                    <>
                        <span className='material-symbols-outlined'>lock</span>
                        {paymentMethodType === 'card' 
                            ? `Pagar ${amount.toFixed(2)}€`
                            : `Pagar con ${methodName}`
                        }
                    </>
                )}
            </button>

            <div className='flex items-center justify-center gap-2 text-xs text-gray-600'>
                <span className='material-symbols-outlined text-green-600' style={{fontSize: '16px'}}>
                    verified_user
                </span>
                <span>Pago seguro procesado por Stripe</span>
            </div>
        </div>
    );
};

export default StripeCheckoutForm;

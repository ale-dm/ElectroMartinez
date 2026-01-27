import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/container/Container';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart } from '../data/reducers/cart';
import { toast } from 'react-toastify';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);

    const handleRemove = (productId, productName) => {
        dispatch(removeFromCart(productId));
        toast.success(`${productName} eliminado del carrito`);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleClearCart = () => {
        if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            dispatch(clearCart());
            toast.info('Carrito vaciado');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

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
                            ¡Descubre nuestros productos y comienza a añadir artículos!
                        </p>
                        <Link
                            to='/shop'
                            className='inline-block bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                        >
                            Explorar Productos
                        </Link>
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
                        <span className='material-symbols-outlined' style={{fontSize: '40px'}}>shopping_cart</span>
                        Mi Carrito
                    </h1>
                    <p className='text-gray-600'>
                        {items.length} producto{items.length !== 1 ? 's' : ''} en tu carrito
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Lista de productos */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                            {/* Header de la tabla */}
                            <div className='hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200 font-bold text-secondary'>
                                <div className='col-span-5'>Producto</div>
                                <div className='col-span-2 text-center'>Precio</div>
                                <div className='col-span-3 text-center'>Cantidad</div>
                                <div className='col-span-2 text-right'>Subtotal</div>
                            </div>

                            {/* Items */}
                            <div className='divide-y divide-gray-200'>
                                {items.map((item) => (
                                    <div key={item._id} className='p-6 hover:bg-gray-50 transition-colors'>
                                        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
                                            {/* Producto */}
                                            <div className='col-span-1 md:col-span-5 flex gap-4'>
                                                {/* Imagen */}
                                                <Link to={`/producto/${item._id}`} className='flex-shrink-0'>
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className='w-24 h-24 object-cover rounded-lg'
                                                        />
                                                    ) : (
                                                        <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                            <span className='material-symbols-outlined text-gray-400'>
                                                                inventory_2
                                                            </span>
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Info */}
                                                <div className='flex-1 min-w-0'>
                                                    <Link 
                                                        to={`/producto/${item._id}`}
                                                        className='font-semibold text-secondary hover:text-primary line-clamp-2 mb-1 block'
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    {item.brand && (
                                                        <p className='text-sm text-gray-500 mb-2'>
                                                            Marca: {item.brand}
                                                        </p>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemove(item._id, item.name)}
                                                        className='flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition-colors md:hidden'
                                                    >
                                                        <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                            delete
                                                        </span>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Precio */}
                                            <div className='col-span-1 md:col-span-2 text-left md:text-center'>
                                                <span className='md:hidden font-semibold text-gray-600 mr-2'>Precio:</span>
                                                <span className='font-bold text-primary text-lg'>
                                                    {item.price.toFixed(2)}€
                                                </span>
                                            </div>

                                            {/* Cantidad */}
                                            <div className='col-span-1 md:col-span-3 flex items-center gap-2 md:justify-center'>
                                                <span className='md:hidden font-semibold text-gray-600'>Cantidad:</span>
                                                <div className='flex items-center border border-gray-300 rounded-lg'>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className='px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                                    >
                                                        <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                            remove
                                                        </span>
                                                    </button>
                                                    <span className='px-4 py-2 border-x border-gray-300 font-bold min-w-[3rem] text-center'>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className='px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                                    >
                                                        <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                            add
                                                        </span>
                                                    </button>
                                                </div>
                                                {item.stock < 5 && (
                                                    <span className='text-xs text-orange-600'>
                                                        Solo {item.stock} disponibles
                                                    </span>
                                                )}
                                            </div>

                                            {/* Subtotal y eliminar (desktop) */}
                                            <div className='col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4'>
                                                <div className='text-left md:text-right'>
                                                    <span className='md:hidden font-semibold text-gray-600 mr-2'>Subtotal:</span>
                                                    <span className='font-bold text-secondary text-xl'>
                                                        {(item.price * item.quantity).toFixed(2)}€
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item._id, item.name)}
                                                    className='hidden md:block p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                                    title='Eliminar'
                                                >
                                                    <span className='material-symbols-outlined'>
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Vaciar carrito */}
                            <div className='p-6 bg-gray-50 border-t border-gray-200'>
                                <button
                                    onClick={handleClearCart}
                                    className='flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors'
                                >
                                    <span className='material-symbols-outlined'>
                                        delete_sweep
                                    </span>
                                    Vaciar carrito
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Resumen del pedido */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-lg shadow-lg p-6 sticky top-4'>
                            <h2 className='text-2xl font-bold text-secondary mb-6'>
                                Resumen del Pedido
                            </h2>

                            {/* Detalles */}
                            <div className='space-y-3 mb-6'>
                                <div className='flex justify-between text-gray-700'>
                                    <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                                    <span className='font-semibold'>{total.toFixed(2)}€</span>
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
                                    <p className='text-xs text-gray-500 mt-1'>IVA incluido</p>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className='space-y-3'>
                                <button
                                    onClick={handleCheckout}
                                    className='w-full bg-primary hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'
                                >
                                    <span className='material-symbols-outlined'>shopping_bag</span>
                                    Proceder al Pago
                                </button>
                                <Link
                                    to='/shop'
                                    className='block w-full text-center bg-gray-200 hover:bg-gray-300 text-secondary font-bold py-3 px-6 rounded-lg transition-colors'
                                >
                                    Seguir Comprando
                                </Link>
                            </div>

                            {/* Info adicional */}
                            <div className='mt-6 pt-6 border-t border-gray-200'>
                                <div className='flex items-start gap-3 text-sm text-gray-600'>
                                    <span className='material-symbols-outlined text-green-600'>
                                        verified_user
                                    </span>
                                    <div>
                                        <p className='font-semibold text-secondary'>Compra Segura</p>
                                        <p className='text-xs'>Tus datos están protegidos</p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 text-sm text-gray-600 mt-4'>
                                    <span className='material-symbols-outlined text-blue-600'>
                                        local_shipping
                                    </span>
                                    <div>
                                        <p className='font-semibold text-secondary'>Envío Gratis</p>
                                        <p className='text-xs'>En todos los pedidos</p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 text-sm text-gray-600 mt-4'>
                                    <span className='material-symbols-outlined text-primary'>
                                        autorenew
                                    </span>
                                    <div>
                                        <p className='font-semibold text-secondary'>Devolución Fácil</p>
                                        <p className='text-xs'>30 días para devoluciones</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Cart;

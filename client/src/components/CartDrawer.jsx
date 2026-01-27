import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCartItems, selectCartTotal, selectIsDrawerOpen, toggleDrawer, removeFromCart, updateQuantity } from '../data/reducers/cart';

const CartDrawer = () => {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const isOpen = useSelector(selectIsDrawerOpen);

    const handleClose = () => {
        dispatch(toggleDrawer(false));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className='fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity'
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                    <h2 className='text-2xl font-bold text-secondary flex items-center gap-2'>
                        <span className='material-symbols-outlined'>shopping_cart</span>
                        Mi Carrito
                    </h2>
                    <button
                        onClick={handleClose}
                        className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                    >
                        <span className='material-symbols-outlined text-gray-600'>close</span>
                    </button>
                </div>

                {/* Items */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {items.length === 0 ? (
                        <div className='text-center py-12'>
                            <span className='material-symbols-outlined text-gray-300' style={{fontSize: '80px'}}>
                                shopping_cart
                            </span>
                            <p className='text-gray-500 mt-4 text-lg'>Tu carrito está vacío</p>
                            <button
                                onClick={handleClose}
                                className='mt-6 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors'
                            >
                                Ir a comprar
                            </button>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {items.map((item) => (
                                <div key={item._id} className='flex gap-4 p-4 bg-gray-50 rounded-lg'>
                                    {/* Imagen */}
                                    <div className='flex-shrink-0'>
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
                                    </div>

                                    {/* Info */}
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-secondary truncate'>
                                            {item.name}
                                        </h3>
                                        {item.brand && (
                                            <p className='text-xs text-gray-500 mt-1'>
                                                Marca: {item.brand}
                                            </p>
                                        )}
                                        <p className='text-primary font-bold mt-2'>
                                            {item.price.toFixed(2)}€
                                        </p>

                                        {/* Controles de cantidad */}
                                        <div className='flex items-center gap-2 mt-3'>
                                            <button
                                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className='w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                            >
                                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                    remove
                                                </span>
                                            </button>
                                            <span className='font-semibold text-secondary w-8 text-center'>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className='w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                            >
                                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                    add
                                                </span>
                                            </button>

                                            {/* Botón eliminar */}
                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                className='ml-auto p-2 text-red-500 hover:bg-red-50 rounded transition-colors'
                                                title='Eliminar'
                                            >
                                                <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                                    delete
                                                </span>
                                            </button>
                                        </div>

                                        {/* Subtotal del item */}
                                        <p className='text-sm text-gray-600 mt-2'>
                                            Subtotal: <span className='font-bold text-secondary'>
                                                {(item.price * item.quantity).toFixed(2)}€
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con total y acciones */}
                {items.length > 0 && (
                    <div className='border-t border-gray-200 p-6 bg-gray-50'>
                        {/* Total */}
                        <div className='flex justify-between items-center mb-4'>
                            <span className='text-lg font-semibold text-secondary'>Total:</span>
                            <span className='text-2xl font-bold text-primary'>{total.toFixed(2)}€</span>
                        </div>

                        {/* Botones */}
                        <div className='space-y-3'>
                            <Link
                                to='/carrito'
                                onClick={handleClose}
                                className='block w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors'
                            >
                                Ver Carrito Completo
                            </Link>
                            <button
                                onClick={handleClose}
                                className='block w-full bg-gray-200 hover:bg-gray-300 text-secondary font-bold py-3 px-6 rounded-lg transition-colors'
                            >
                                Seguir Comprando
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;

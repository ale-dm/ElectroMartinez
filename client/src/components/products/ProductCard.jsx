import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, toggleDrawer } from '../../data/reducers/cart';
import { toast } from 'react-toastify';
import FavoriteButton from '../FavoriteButton';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [addingToCart, setAddingToCart] = useState(false);
    
    const { 
        _id, name, description, price, images, category, 
        badge, rating, discount, finalPrice, isOnSale,
        condition, quantity, brand
    } = product;
    const firstImage = images && images.length > 0 ? images[0].url : null;
    
    // Calcular precio final con descuento
    const displayPrice = isOnSale && finalPrice ? finalPrice : price;
    const hasDiscount = isOnSale && discount?.percentage > 0;
    const inStock = quantity > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!inStock) {
            toast.error('Producto agotado');
            return;
        }

        setAddingToCart(true);
        
        dispatch(addToCart({
            _id,
            name,
            price: displayPrice,
            images,
            quantity: 1,
            stock: quantity,
            brand
        }));

        toast.success('Producto añadido al carrito');
        
        // Abrir drawer después de un breve delay
        setTimeout(() => {
            dispatch(toggleDrawer(true));
            setAddingToCart(false);
        }, 300);
    };

    return (
        <div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full'>
            <Link to={`/producto/${_id}`} className='flex-shrink-0'>
                <div className='relative'>
                    {firstImage ? (
                        <img
                            src={firstImage}
                            alt={name}
                            loading="lazy"
                            className='w-full h-64 object-cover'
                        />
                    ) : (
                        <div className='w-full h-64 bg-gray-100 flex items-center justify-center'>
                            <span className='material-symbols-outlined text-gray-400' style={{fontSize: '80px'}}>
                                inventory_2
                            </span>
                        </div>
                    )}
                    
                    {/* Badges */}
                    <div className='absolute top-2 left-2 flex flex-col gap-2'>
                        {category && (
                            <span className='bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold'>
                                {category.name}
                            </span>
                        )}
                        {badge && (
                            <span className='bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase'>
                                {badge.replace('-', ' ')}
                            </span>
                        )}
                        {condition && condition !== 'nuevo' && (
                            <span className='bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase'>
                                {condition}
                            </span>
                        )}
                        {!inStock && (
                            <span className='bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold'>
                                AGOTADO
                            </span>
                        )}
                    </div>

                    {/* Descuento */}
                    {hasDiscount && (
                        <div className='absolute top-2 right-12 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform hover:scale-105 transition-transform'>
                            <div className='flex items-center gap-1'>
                                <span className='material-symbols-outlined' style={{fontSize: '16px'}}>sell</span>
                                -{discount.percentage}%
                            </div>
                        </div>
                    )}
                    
                    <div className='absolute top-2 right-2'>
                        <FavoriteButton product={product} />
                    </div>
                </div>
            </Link>
            
            <div className='p-4 flex flex-col flex-1'>
                <Link to={`/producto/${_id}`}>
                    <h3 className='font-bold text-secondary mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[3rem]'>
                        {name}
                    </h3>
                </Link>
                
                {/* Rating */}
                {rating && rating.count > 0 && (
                    <div className='flex items-center gap-1 mb-2'>
                        <div className='flex'>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className='material-symbols-outlined text-primary' style={{fontSize: '16px'}}>
                                    {i < Math.floor(rating.average) ? 'star' : 'star_border'}
                                </span>
                            ))}
                        </div>
                        <span className='text-xs text-gray-600'>
                            ({rating.count})
                        </span>
                    </div>
                )}

                <div className='text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]'>
                    {description || ' '}
                </div>
                
                <div className='flex flex-col gap-3 mt-auto'>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col'>
                            {hasDiscount ? (
                                <>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg text-gray-400 line-through'>{price.toFixed(2)}€</span>
                                        <span className='bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded'>
                                            -{discount.percentage}%
                                        </span>
                                    </div>
                                    <span className='text-2xl font-bold text-red-600'>{displayPrice.toFixed(2)}€</span>
                                    <span className='text-xs text-green-600 font-medium'>
                                        ¡Ahorras {(price - displayPrice).toFixed(2)}€!
                                    </span>
                                </>
                            ) : (
                                <span className='text-2xl font-bold text-primary'>{displayPrice.toFixed(2)}€</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Botones */}
                    <div className='flex gap-2'>
                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock || addingToCart}
                            className={`flex-1 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded transition-colors ${
                                inStock 
                                    ? 'bg-primary hover:bg-yellow-600 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                {addingToCart ? 'hourglass_empty' : 'shopping_cart'}
                            </span>
                            {addingToCart ? 'Añadiendo...' : 'Añadir'}
                        </button>
                        <Link 
                            to={`/producto/${_id}`}
                            className='bg-gray-200 hover:bg-gray-300 text-secondary font-bold py-2 px-4 rounded transition-colors'
                        >
                            Ver
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

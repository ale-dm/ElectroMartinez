import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Container from '../components/container/Container';
import FavoriteButton from '../components/FavoriteButton';
import ProductReviews from '../components/reviews/ProductReviews';
import RecommendedProducts from '../components/products/RecommendedProducts';
import SEO from '../components/SEO';
import { URLDevelopment } from '../helpers/URL';
import { getProduct, clearProduct } from '../data/reducers/product';
import { addToCart, toggleDrawer } from '../data/reducers/cart';

const ProductDetail = ({ getProduct, clearProduct, product, loading, isAuth }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        getProduct(id);
        
        // Track view si el usuario está autenticado
        if (isAuth) {
            trackProductView();
        }
        
        return () => {
            clearProduct();
        };
    }, [getProduct, clearProduct, id, isAuth]);

    const trackProductView = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${URLDevelopment}/api/product/${id}/view`,
                {},
                { headers: { 'x-auth-token': token } }
            );
        } catch (error) {
            // Silently fail - tracking no es crítico
            console.debug('Could not track view:', error);
        }
    };

    const handleQuantityChange = (type) => {
        if (type === 'increment' && quantity < product.quantity) {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (!product.quantity || product.quantity === 0) {
            toast.error('Producto agotado');
            return;
        }

        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            price: displayPrice,
            images: product.images,
            quantity: quantity,
            stock: product.quantity,
            brand: product.brand
        }));

        toast.success(`${quantity} unidad${quantity > 1 ? 'es' : ''} añadida${quantity > 1 ? 's' : ''} al carrito`);
        
        // Abrir drawer después de un breve delay
        setTimeout(() => {
            dispatch(toggleDrawer(true));
        }, 300);
    };

    if (loading) {
        return (
            <Container>
                <div className='text-center py-20'>
                    <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                        progress_activity
                    </span>
                    <p className='text-gray-600 mt-4 text-lg'>Cargando producto...</p>
                </div>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container>
                <div className='text-center py-20'>
                    <span className='material-symbols-outlined text-gray-400' style={{fontSize: '80px'}}>
                        error
                    </span>
                    <p className='text-gray-600 mt-4 text-lg'>Producto no encontrado</p>
                    <Link to='/shop' className='inline-block mt-6 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded transition-colors'>
                        Volver a la tienda
                    </Link>
                </div>
            </Container>
        );
    }

    const { 
        _id, name, description, price, quantity: stock, category, shipping, images,
        brand, manufacturer, model, condition, sku, badge,
        discount, finalPrice, isOnSale,
        specifications, highlights, packageContents, tags,
        colors, sizes, material,
        weight, dimensions,
        freeShipping, deliveryTime, isFragile, requiresInstallation,
        energyClass, warranty, connectivity, operatingSystem, processor, ram, storage, powerConsumption,
        videoUrl, manualPdfUrl,
        rating
    } = product;
    const productImages = images && images.length > 0 ? images : [];

    const displayPrice = isOnSale && finalPrice ? finalPrice : price;
    const hasDiscount = isOnSale && discount?.percentage > 0;

    // SEO Data
    const productDescription = description?.replace(/<[^>]*>/g, '').substring(0, 160) || 
                              `${name} - ${brand?.name || 'ElectroMartinez'}`;
    const productImage = productImages.length > 0 ? productImages[0].url : '/logo.png';
    const productUrl = window.location.href;
    const productKeywords = [
        name,
        brand?.name,
        category?.name,
        ...tags,
        'electrodomésticos',
        'comprar online'
    ].filter(Boolean).join(', ');

    return (
        <>
            <SEO
                title={`${name}${brand?.name ? ` - ${brand.name}` : ''}`}
                description={productDescription}
                keywords={productKeywords}
                image={productImage}
                url={productUrl}
                type="product"
                price={displayPrice}
                currency="EUR"
                availability={stock > 0 ? 'in stock' : 'out of stock'}
                canonical={productUrl}
            />
            
            {/* Breadcrumb */}
            <div className='bg-gray-100 py-4'>
                <Container>
                    <div className='flex items-center gap-2 text-sm'>
                        <Link to='/' className='text-gray-600 hover:text-primary'>Inicio</Link>
                        <span className='material-symbols-outlined text-gray-400' style={{fontSize: '16px'}}>chevron_right</span>
                        <Link to='/shop' className='text-gray-600 hover:text-primary'>Productos</Link>
                        {category && (
                            <>
                                <span className='material-symbols-outlined text-gray-400' style={{fontSize: '16px'}}>chevron_right</span>
                                <span className='text-gray-600'>{category.name}</span>
                            </>
                        )}
                        <span className='material-symbols-outlined text-gray-400' style={{fontSize: '16px'}}>chevron_right</span>
                        <span className='text-secondary font-medium'>{name}</span>
                    </div>
                </Container>
            </div>

            {/* Detalle del Producto */}
            <Container>
                <div className='my-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Galería de Imágenes */}
                        <div className='lg:col-span-1'>
                            <div className='bg-white rounded-lg shadow-lg p-6 sticky top-4'>
                                {productImages.length > 0 ? (
                                    <>
                                        <div className='mb-4 relative'>
                                            {badge && (
                                                <span className='absolute top-2 left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase'>
                                                    {badge.replace('-', ' ')}
                                                </span>
                                            )}
                                            <img
                                                src={productImages[selectedImage].url}
                                                alt={name}
                                                className='w-full h-auto object-contain rounded-lg'
                                            />
                                        </div>
                                        {productImages.length > 1 && (
                                            <div className='grid grid-cols-4 gap-2'>
                                                {productImages.map((image, index) => (
                                                    <button
                                                        key={image.public_id}
                                                        onClick={() => setSelectedImage(index)}
                                                        className={`border-2 rounded-lg p-2 transition-all ${
                                                            selectedImage === index 
                                                                ? 'border-primary' 
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <img
                                                            src={image.url}
                                                            alt={`${name} ${index + 1}`}
                                                            className='w-full h-20 object-contain'
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className='w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg'>
                                        <span className='material-symbols-outlined text-gray-400' style={{fontSize: '120px'}}>
                                            inventory_2
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información Principal */}
                        <div className='lg:col-span-2 space-y-6'>
                            {/* Header */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        {category && (
                                            <span className='inline-block bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold'>
                                                {category.name}
                                            </span>
                                        )}
                                        {condition && condition !== 'nuevo' && (
                                            <span className='inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase'>
                                                {condition}
                                            </span>
                                        )}
                                    </div>
                                    <FavoriteButton product={product} className='shadow-lg' />
                                </div>
                                
                                <h1 className='text-3xl md:text-4xl font-bold text-secondary mb-2'>
                                    {name}
                                </h1>

                                {(brand || manufacturer || model) && (
                                    <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
                                        {brand && <span><strong>Marca:</strong> {brand}</span>}
                                        {manufacturer && <span><strong>Fabricante:</strong> {manufacturer}</span>}
                                        {model && <span><strong>Modelo:</strong> {model}</span>}
                                        {sku && <span className='text-gray-400'>SKU: {sku}</span>}
                                    </div>
                                )}

                                {rating && rating.count > 0 && (
                                    <div className='flex items-center gap-2 mb-4'>
                                        <div className='flex items-center'>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className='material-symbols-outlined text-primary' style={{fontSize: '20px'}}>
                                                    {i < Math.floor(rating.average) ? 'star' : 'star_border'}
                                                </span>
                                            ))}
                                        </div>
                                        <span className='text-sm text-gray-600'>
                                            {rating.average.toFixed(1)} ({rating.count} {rating.count === 1 ? 'valoración' : 'valoraciones'})
                                        </span>
                                    </div>
                                )}

                                <div className='mb-6'>
                                    {hasDiscount ? (
                                        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                                            <div className='flex items-center gap-2 mb-3'>
                                                <span className='bg-red-600 text-white px-3 py-1 rounded text-sm font-bold'>
                                                    -{discount.percentage}%
                                                </span>
                                                <span className='text-sm text-gray-600'>de descuento</span>
                                            </div>
                                            <div className='flex items-baseline gap-4'>
                                                <span className='text-2xl text-gray-400 line-through'>
                                                    {price.toFixed(2)}€
                                                </span>
                                                <span className='text-5xl font-bold text-red-600'>
                                                    {displayPrice.toFixed(2)}€
                                                </span>
                                            </div>
                                            <p className='text-sm text-green-600 mt-2'>
                                                Ahorras {(price - displayPrice).toFixed(2)}€
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='flex items-baseline gap-3'>
                                            <span className='text-5xl font-bold text-primary'>{displayPrice.toFixed(2)}€</span>
                                            <span className='text-gray-500'>IVA incluido</span>
                                        </div>
                                    )}
                                </div>

                                <div className='flex items-center gap-3 mb-6'>
                                    {stock > 0 ? (
                                        <span className='flex items-center gap-1 text-green-600'>
                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>check_circle</span>
                                            <span className='font-medium'>En stock ({stock} disponibles)</span>
                                        </span>
                                    ) : (
                                        <span className='flex items-center gap-1 text-red-600'>
                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>cancel</span>
                                            <span className='font-medium'>Sin stock</span>
                                        </span>
                                    )}
                                </div>

                                {/* Cantidad y Añadir al carrito */}
                                {stock > 0 && (
                                    <div className='bg-gray-50 p-6 rounded-lg'>
                                        <div className='flex items-center gap-4 mb-4'>
                                            <span className='text-gray-700 font-medium'>Cantidad:</span>
                                            <div className='flex items-center border border-gray-300 rounded-lg'>
                                                <button
                                                    onClick={() => handleQuantityChange('decrement')}
                                                    className='px-4 py-2 hover:bg-gray-100 transition-colors'
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '20px'}}>remove</span>
                                                </button>
                                                <span className='px-6 py-2 border-x border-gray-300 font-bold'>{quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange('increment')}
                                                    className='px-4 py-2 hover:bg-gray-100 transition-colors'
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '20px'}}>add</span>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className='w-full bg-primary hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'
                                        >
                                            <span className='material-symbols-outlined'>shopping_cart</span>
                                            Añadir al carrito
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Descripción */}
                            {description && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-4 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>description</span>
                                        Descripción
                                    </h2>
                                    <div 
                                        className='text-gray-700 leading-relaxed prose prose-sm max-w-none'
                                        dangerouslySetInnerHTML={{ __html: description }}
                                        style={{
                                            fontSize: '15px',
                                            lineHeight: '1.8'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Características Destacadas */}
                            {highlights && highlights.length > 0 && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>star</span>
                                        Características Destacadas
                                    </h2>
                                    <ul className='space-y-2'>
                                        {highlights.map((highlight, index) => (
                                            <li key={index} className='flex items-start gap-2 text-gray-700'>
                                                <span className='material-symbols-outlined text-primary mt-0.5' style={{fontSize: '20px'}}>check_circle</span>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Especificaciones Técnicas */}
                            {specifications && specifications.length > 0 && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>settings</span>
                                        Especificaciones Técnicas
                                    </h2>
                                    <div className='grid grid-cols-1 gap-2'>
                                        {specifications.map((spec, index) => (
                                            <div key={index} className='flex justify-between py-2 border-b border-gray-200 last:border-0'>
                                                <span className='font-medium text-gray-700'>{spec.key}</span>
                                                <span className='text-gray-600'>{spec.value} {spec.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Detalles del Producto */}
                            {(processor || ram || storage || operatingSystem || energyClass || warranty || connectivity?.length > 0) && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>info</span>
                                        Detalles del Producto
                                    </h2>
                                    <div className='grid grid-cols-1 gap-2'>
                                        {processor && (
                                            <div className='flex justify-between py-2 border-b border-gray-200'>
                                                <span className='font-medium text-gray-700'>Procesador</span>
                                                <span className='text-gray-600'>{processor}</span>
                                            </div>
                                        )}
                                        {ram && (
                                            <div className='flex justify-between py-2 border-b border-gray-200'>
                                                <span className='font-medium text-gray-700'>RAM</span>
                                                <span className='text-gray-600'>{ram}</span>
                                            </div>
                                        )}
                                        {storage && (
                                            <div className='flex justify-between py-2 border-b border-gray-200'>
                                                <span className='font-medium text-gray-700'>Almacenamiento</span>
                                                <span className='text-gray-600'>{storage}</span>
                                            </div>
                                        )}
                                        {operatingSystem && (
                                            <div className='flex justify-between py-2 border-b border-gray-200'>
                                                <span className='font-medium text-gray-700'>Sistema Operativo</span>
                                                <span className='text-gray-600'>{operatingSystem}</span>
                                            </div>
                                        )}
                                        {energyClass && (
                                            <div className='flex justify-between py-2 border-b border-gray-200'>
                                                <span className='font-medium text-gray-700'>Clase Energética</span>
                                                <span className='text-gray-600 font-bold'>{energyClass}</span>
                                            </div>
                                        )}
                                        {warranty && (
                                            <div className='flex justify-between py-2 border-b border-gray-200'>
                                                <span className='font-medium text-gray-700'>Garantía</span>
                                                <span className='text-gray-600'>{warranty}</span>
                                            </div>
                                        )}
                                        {connectivity && connectivity.length > 0 && (
                                            <div className='flex justify-between py-2'>
                                                <span className='font-medium text-gray-700'>Conectividad</span>
                                                <span className='text-gray-600'>{connectivity.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Variantes: Colores y Tallas */}
                            {(colors?.length > 0 || sizes?.length > 0) && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>palette</span>
                                        Variantes Disponibles
                                    </h2>
                                    {colors && colors.length > 0 && (
                                        <div className='mb-4'>
                                            <h3 className='text-sm font-medium text-gray-700 mb-2'>Colores:</h3>
                                            <div className='flex flex-wrap gap-2'>
                                                {colors.map((color, index) => (
                                                    <div key={index} className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2'>
                                                        <div 
                                                            className='w-6 h-6 rounded-full border-2 border-gray-300'
                                                            style={{backgroundColor: color.hex}}
                                                        />
                                                        <span className='text-sm'>{color.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {sizes && sizes.length > 0 && (
                                        <div>
                                            <h3 className='text-sm font-medium text-gray-700 mb-2'>Tallas / Capacidades:</h3>
                                            <div className='flex flex-wrap gap-2'>
                                                {sizes.map((size, index) => (
                                                    <span key={index} className='border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium'>
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dimensiones y Peso */}
                            {(weight || dimensions?.height || dimensions?.width || dimensions?.depth) && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>straighten</span>
                                        Dimensiones y Peso
                                    </h2>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {weight && (
                                            <div className='flex items-center gap-2'>
                                                <span className='material-symbols-outlined text-gray-400'>scale</span>
                                                <div>
                                                    <p className='text-xs text-gray-500'>Peso</p>
                                                    <p className='font-medium'>{weight} kg</p>
                                                </div>
                                            </div>
                                        )}
                                        {dimensions?.height && (
                                            <div className='flex items-center gap-2'>
                                                <span className='material-symbols-outlined text-gray-400'>height</span>
                                                <div>
                                                    <p className='text-xs text-gray-500'>Alto</p>
                                                    <p className='font-medium'>{dimensions.height} cm</p>
                                                </div>
                                            </div>
                                        )}
                                        {dimensions?.width && (
                                            <div className='flex items-center gap-2'>
                                                <span className='material-symbols-outlined text-gray-400'>width</span>
                                                <div>
                                                    <p className='text-xs text-gray-500'>Ancho</p>
                                                    <p className='font-medium'>{dimensions.width} cm</p>
                                                </div>
                                            </div>
                                        )}
                                        {dimensions?.depth && (
                                            <div className='flex items-center gap-2'>
                                                <span className='material-symbols-outlined text-gray-400'>deploy</span>
                                                <div>
                                                    <p className='text-xs text-gray-500'>Profundo</p>
                                                    <p className='font-medium'>{dimensions.depth} cm</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contenido del Paquete */}
                            {packageContents && packageContents.length > 0 && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>inventory</span>
                                        Contenido del Paquete
                                    </h2>
                                    <ul className='space-y-1'>
                                        {packageContents.map((item, index) => (
                                            <li key={index} className='flex items-center gap-2 text-gray-700'>
                                                <span className='material-symbols-outlined text-gray-400' style={{fontSize: '18px'}}>check</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Información de Envío */}
                            {(shipping || freeShipping || deliveryTime || isFragile || requiresInstallation) && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>local_shipping</span>
                                        Información de Envío
                                    </h2>
                                    <div className='space-y-2'>
                                        {freeShipping && (
                                            <div className='flex items-center gap-2 text-green-600'>
                                                <span className='material-symbols-outlined'>check_circle</span>
                                                <span className='font-medium'>Envío gratuito</span>
                                            </div>
                                        )}
                                        {shipping !== undefined && !freeShipping && (
                                            <div className='flex items-center gap-2 text-blue-600'>
                                                <span className='material-symbols-outlined'>local_shipping</span>
                                                <span>{shipping ? 'Envío disponible' : 'Recogida en tienda'}</span>
                                            </div>
                                        )}
                                        {deliveryTime && (
                                            <div className='flex items-center gap-2 text-gray-700'>
                                                <span className='material-symbols-outlined'>schedule</span>
                                                <span>Tiempo de entrega: {deliveryTime}</span>
                                            </div>
                                        )}
                                        {isFragile && (
                                            <div className='flex items-center gap-2 text-orange-600'>
                                                <span className='material-symbols-outlined'>warning</span>
                                                <span>Producto frágil - embalaje especial</span>
                                            </div>
                                        )}
                                        {requiresInstallation && (
                                            <div className='flex items-center gap-2 text-gray-700'>
                                                <span className='material-symbols-outlined'>build</span>
                                                <span>Requiere instalación</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Video */}
                            {videoUrl && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>play_circle</span>
                                        Video del Producto
                                    </h2>
                                    <div className='aspect-video'>
                                        <iframe
                                            src={videoUrl.includes('youtube.com') ? videoUrl.replace('watch?v=', 'embed/') : videoUrl}
                                            className='w-full h-full rounded-lg'
                                            allowFullScreen
                                            title='Video del producto'
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Manual PDF */}
                            {manualPdfUrl && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <a 
                                        href={manualPdfUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-3 text-primary hover:text-yellow-600 transition-colors'
                                    >
                                        <span className='material-symbols-outlined' style={{fontSize: '32px'}}>picture_as_pdf</span>
                                        <div>
                                            <p className='font-bold'>Descargar Manual</p>
                                            <p className='text-sm text-gray-600'>Manual de usuario en PDF</p>
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* Tags */}
                            {tags && tags.length > 0 && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-bold text-secondary mb-3 flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>label</span>
                                        Etiquetas
                                    </h2>
                                    <div className='flex flex-wrap gap-2'>
                                        {tags.map((tag, index) => (
                                            <span key={index} className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección de Reseñas */}
                    <div className='mt-8'>
                        <ProductReviews productId={_id} />
                    </div>

                    {/* Botón volver */}
                    <div className='mt-8'>
                        <button
                            onClick={() => navigate(-1)}
                            className='flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors'
                        >
                            <span className='material-symbols-outlined'>arrow_back</span>
                            Volver
                        </button>
                    </div>
                </div>
            </Container>

            {/* Productos Recomendados */}
            <RecommendedProducts title='También te puede interesar' />
        </>
    );
};

const mapStateToProps = (state) => ({
    product: state.product.product,
    loading: state.product.loading,
    isAuth: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getProduct, clearProduct })(ProductDetail);

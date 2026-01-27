import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/container/Container';
import ProductCard from '../components/products/ProductCard';
import axios from 'axios';
import { URLDevelopment } from '../helpers/URL';

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryProducts();
    }, [slug]);

    const fetchCategoryProducts = async () => {
        setLoading(true);
        try {
            // Obtener categoría, subcategorías y productos desde un solo endpoint
            const response = await axios.get(`${URLDevelopment}/api/product/by-category/${slug}`);
            
            setCategory(response.data.category);
            setSubcategories(response.data.subcategories || []);
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setCategory(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <div className='text-center py-20'>
                    <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                        progress_activity
                    </span>
                    <p className='text-gray-600 mt-4 text-lg'>Cargando productos...</p>
                </div>
            </Container>
        );
    }

    if (!category) {
        return (
            <Container>
                <div className='text-center py-20'>
                    <span className='material-symbols-outlined text-gray-400' style={{fontSize: '80px'}}>
                        error
                    </span>
                    <p className='text-gray-600 mt-4 text-lg'>Categoría no encontrada</p>
                    <Link to='/shop' className='inline-block mt-6 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded transition-colors'>
                        Volver a la tienda
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <>
            {/* Header */}
            <div className='bg-gray-50 border-b-4 border-primary py-8'>
                <Container>
                    {/* Breadcrumbs */}
                    <div className='flex items-center gap-2 text-sm mb-4 text-gray-600'>
                        <Link to='/' className='hover:text-primary transition-colors'>Inicio</Link>
                        <span className='material-symbols-outlined' style={{fontSize: '16px'}}>chevron_right</span>
                        <Link to='/shop' className='hover:text-primary transition-colors'>Productos</Link>
                        <span className='material-symbols-outlined' style={{fontSize: '16px'}}>chevron_right</span>
                        {category.parent && (
                            <>
                                <Link to={`/categoria/${category.parent.slug}`} className='hover:text-primary transition-colors'>
                                    {category.parent.name}
                                </Link>
                                <span className='material-symbols-outlined' style={{fontSize: '16px'}}>chevron_right</span>
                            </>
                        )}
                        <span className='text-secondary font-medium'>{category.name}</span>
                    </div>

                    {/* Título y contador */}
                    <div className='flex items-center gap-4 mb-3'>
                        {category.image?.url && (
                            <img 
                                src={category.image.url} 
                                alt={category.name}
                                className='w-20 h-20 object-cover rounded-lg shadow-md border-2 border-primary'
                            />
                        )}
                        <div>
                            <h1 className='text-4xl font-bold text-secondary mb-1'>{category.name}</h1>
                            <p className='text-gray-500 text-sm'>
                                {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                            </p>
                        </div>
                    </div>
                    
                    {category.description && (
                        <p className='text-gray-600 mt-2 text-base max-w-3xl'>{category.description}</p>
                    )}
                </Container>
            </div>

            <Container>
                {/* Subcategorías */}
                {subcategories.length > 0 && (
                    <div className='py-8 border-b border-gray-200'>
                        <h2 className='text-2xl font-bold text-secondary mb-5 flex items-center gap-2'>
                            <span className='material-symbols-outlined text-primary'>category</span>
                            Subcategorías
                        </h2>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                            {subcategories.map((subcat) => (
                                <Link
                                    key={subcat._id}
                                    to={`/categoria/${subcat.slug}`}
                                    className='flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all border border-gray-200 hover:border-primary group'
                                >
                                    {subcat.image?.url ? (
                                        <img 
                                            src={subcat.image.url} 
                                            alt={subcat.name}
                                            className='w-16 h-16 object-cover rounded-lg mb-2'
                                        />
                                    ) : (
                                        <span className='material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors' style={{fontSize: '48px'}}>
                                            folder
                                        </span>
                                    )}
                                    <p className='text-sm font-medium text-gray-700 text-center group-hover:text-secondary transition-colors'>
                                        {subcat.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Productos */}
                <div className='py-12'>
                    {products.length === 0 ? (
                        <div className='text-center py-20'>
                            <span className='material-symbols-outlined text-gray-300' style={{fontSize: '120px'}}>
                                inventory_2
                            </span>
                            <h2 className='text-2xl font-bold text-gray-700 mt-4 mb-2'>
                                No hay productos en esta categoría
                            </h2>
                            <p className='text-gray-500 mb-8'>
                                Explora otras categorías o vuelve más tarde
                            </p>
                            <Link
                                to='/shop'
                                className='inline-flex items-center gap-2 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded transition-colors'
                            >
                                <span className='material-symbols-outlined'>storefront</span>
                                Ver Todos los Productos
                            </Link>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default CategoryPage;

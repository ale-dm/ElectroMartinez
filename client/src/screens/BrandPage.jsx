import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/container/Container';
import ProductCard from '../components/products/ProductCard';
import axios from 'axios';
import { URLDevelopment } from '../helpers/URL';

const BrandPage = () => {
    const { brand } = useParams();
    const [products, setProducts] = useState([]);
    const [brandData, setBrandData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrandProducts();
    }, [brand]);

    const fetchBrandProducts = async () => {
        setLoading(true);
        try {
            // Obtener todos los productos y filtrar por marca
            const productsRes = await axios.get(`${URLDevelopment}/api/product/list?limit=100`);
            const filteredProducts = productsRes.data.filter(
                product => product.brand && product.brand.toLowerCase() === decodeURIComponent(brand).toLowerCase()
            );
            setProducts(filteredProducts);
            
            // Intentar obtener datos de la marca si existe
            try {
                const brandsRes = await axios.get(`${URLDevelopment}/api/brand/all`);
                const foundBrand = brandsRes.data.find(b => b.slug === brand || b.name.toLowerCase() === decodeURIComponent(brand).toLowerCase());
                if (foundBrand) {
                    setBrandData(foundBrand);
                }
            } catch (err) {
                // Info adicional no crítica
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
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

    const displayName = brandData?.name || decodeURIComponent(brand);

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
                        <span className='text-secondary font-medium'>{displayName}</span>
                    </div>

                    {/* Título y contador */}
                    <div className='flex items-center gap-4 mb-3'>
                        {brandData?.image?.url && (
                            <img 
                                src={brandData.image.url} 
                                alt={displayName}
                                className='w-20 h-20 object-contain rounded-lg shadow-md border-2 border-primary bg-white p-2'
                            />
                        )}
                        <div>
                            <h1 className='text-4xl font-bold text-secondary mb-1'>Productos {displayName}</h1>
                            <p className='text-gray-500 text-sm'>
                                {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                            </p>
                        </div>
                    </div>
                    
                    {brandData?.description && (
                        <p className='text-gray-600 mt-2 text-base max-w-3xl'>{brandData.description}</p>
                    )}
                    
                    {brandData?.website && (
                        <a
                            href={brandData.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 mt-3 text-primary hover:text-yellow-700 font-medium'
                        >
                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>language</span>
                            Visitar sitio web oficial
                        </a>
                    )}
                </Container>
            </div>

            {/* Productos */}
            <Container>
                <div className='py-12'>
                    {products.length === 0 ? (
                        <div className='text-center py-20'>
                            <span className='material-symbols-outlined text-gray-300' style={{fontSize: '120px'}}>
                                inventory_2
                            </span>
                            <h2 className='text-2xl font-bold text-gray-700 mt-4 mb-2'>
                                No hay productos de la marca {displayName}
                            </h2>
                            <p className='text-gray-500 mb-8'>
                                Explora otras marcas o vuelve más tarde
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

export default BrandPage;

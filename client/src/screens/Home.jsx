import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/container/Container';
import ProductCard from '../components/products/ProductCard';
import RecommendedProducts from '../components/products/RecommendedProducts';
import RecentlyViewedProducts from '../components/products/RecentlyViewedProducts';
import SEO from '../components/SEO';
import axios from 'axios';
import { URLDevelopment } from '../helpers/URL';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/product/featured`);
            setFeaturedProducts(res.data);
        } catch (error) {
            console.error('Error al cargar productos destacados:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/category/all`);
            // Filtrar solo categorías padre (sin parent) y activas
            const parentCategories = res.data.filter(cat => !cat.parent && cat.isActive);
            setCategories(parentCategories);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/brand/all`);
            const activeBrands = res.data.filter(brand => brand.isActive);
            setBrands(activeBrands.slice(0, 10)); // Mostrar máximo 10 marcas
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        }
    };

    return (
        <>
            <SEO 
                title="Inicio - ElectroMartinez"
                description="Descubre los mejores electrodomésticos: lavadoras, frigoríficos, televisores y más. Envío gratis en pedidos superiores a 50€."
                keywords="electrodomésticos, lavadoras, frigoríficos, televisores, electrónica, ofertas"
            />
            {/* Hero Banner */}
            <div className='bg-gradient-to-r from-secondary to-dark text-white py-8'>
                <Container>
                    <div className='text-center'>
                        <h1 className='text-3xl md:text-4xl font-bold mb-3'>
                            <span className='text-primary'>Elige una categoría</span>
                        </h1>
                        <p className='text-sm md:text-base text-gray-300 max-w-3xl mx-auto'>
                            En ElectroMartinez encontrarás los mejores precios, con una selección de electrodomésticos de gran calidad. 
                            Te ofrecemos las mejores marcas: Bosch, Balay, Samsung, Siemens, Teka, Electrolux, AEG, LG...
                        </p>
                    </div>
                </Container>
            </div>

            {/* Categorías Grid */}
            <Container>
                <div className='my-12'>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {categories.map((category) => (
                            <Link 
                                key={category._id}
                                to={`/categoria/${category.slug}`}
                                className='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'
                            >
                                <div className='aspect-square flex items-center justify-center mb-3 overflow-hidden rounded-lg'>
                                    {category.image && category.image.url ? (
                                        <img 
                                            src={category.image.url} 
                                            alt={category.name}
                                            loading="lazy"
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <span className='material-symbols-outlined text-primary' style={{fontSize: '80px'}}>
                                            category
                                        </span>
                                    )}
                                </div>
                                <h3 className='text-center font-bold text-secondary'>{category.name}</h3>
                                {category.description && (
                                    <p className='text-center text-xs text-gray-500 mt-1 line-clamp-2'>
                                        {category.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Marcas */}
                <div className='my-12'>
                    <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>
                        <span className='text-primary'>Elige una marca</span>
                    </h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
                        {brands.map((brand) => (
                            <Link
                                key={brand._id}
                                to={`/marca/${brand.slug}`}
                                className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border border-gray-200 hover:border-primary group'
                            >
                                {brand.image?.url ? (
                                    <img 
                                        src={brand.image.url} 
                                        alt={brand.name}
                                        loading="lazy"
                                        className='w-full h-16 object-contain mb-3'
                                    />
                                ) : (
                                    <div className='flex items-center justify-center h-16 mb-3'>
                                        <h3 className='text-center font-bold text-2xl text-secondary group-hover:text-primary transition-colors'>{brand.name}</h3>
                                    </div>
                                )}
                                <p className='text-center text-sm text-gray-500 mt-2'>Ver productos</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Ofertas Destacadas */}
                {featuredProducts.length > 0 && (
                    <div className='my-12'>
                        <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>
                            Productos <span className='text-primary'>destacados</span>
                        </h2>
                        {loading ? (
                            <div className='text-center py-12'>
                                <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                                    progress_activity
                                </span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                        <div className='text-center mt-8'>
                            <Link 
                                to='/shop'
                                className='inline-block bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                            >
                                Ver todos los productos
                            </Link>
                        </div>
                    </div>
                )}
            </Container>

            {/* Productos Recomendados Personalizados */}
            <RecommendedProducts />

            {/* Productos Vistos Recientemente */}
            <RecentlyViewedProducts />
        </>
    );
};

export default Home;

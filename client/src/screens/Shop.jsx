import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Container from '../components/container/Container';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import SEO from '../components/SEO';
import { getProducts } from '../data/reducers/product';

const Shop = ({ getProducts, products, loading }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [filters, setFilters] = useState({
        category: null,
        brand: null,
        tags: [],
        colors: [],
        minRating: null,
        condition: null,
        availability: null,
        priceRange: { min: 0, max: 10000 }
    });
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Cargar filtros desde URL al montar
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const brandParam = searchParams.get('brand');
        const tagsParam = searchParams.get('tags');
        const minPriceParam = searchParams.get('minPrice');
        const maxPriceParam = searchParams.get('maxPrice');
        const minRatingParam = searchParams.get('minRating');

        setFilters(prev => ({
            ...prev,
            category: categoryParam || null,
            brand: brandParam || null,
            tags: tagsParam ? tagsParam.split(',') : [],
            priceRange: {
                min: minPriceParam ? Number(minPriceParam) : 0,
                max: maxPriceParam ? Number(maxPriceParam) : 10000
            },
            minRating: minRatingParam ? Number(minRatingParam) : null
        }));
    }, []);

    useEffect(() => {
        getProducts(sortBy, order, 100);
    }, [getProducts, sortBy, order]);

    useEffect(() => {
        // Actualizar URL con filtros
        const params = new URLSearchParams();
        
        if (filters.category) params.set('category', filters.category);
        if (filters.brand) params.set('brand', filters.brand);
        if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
        if (filters.priceRange.min > 0) params.set('minPrice', filters.priceRange.min.toString());
        if (filters.priceRange.max < 10000) params.set('maxPrice', filters.priceRange.max.toString());
        if (filters.minRating) params.set('minRating', filters.minRating.toString());
        
        setSearchParams(params, { replace: true });

        // Aplicar filtros
        let filtered = [...products];

        // Filtro por categoría
        if (filters.category) {
            filtered = filtered.filter(p => p.category && p.category._id === filters.category);
        }

        // Filtro por marca
        if (filters.brand) {
            filtered = filtered.filter(p => p.brand && p.brand === filters.brand);
        }

        // Filtro por tags
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(p => 
                p.tags && p.tags.some(tag => filters.tags.includes(tag))
            );
        }

        // Filtro por colores
        if (filters.colors && filters.colors.length > 0) {
            filtered = filtered.filter(p => 
                p.colors && p.colors.some(color => filters.colors.includes(color.name))
            );
        }

        // Filtro por rating mínimo
        if (filters.minRating) {
            filtered = filtered.filter(p => 
                p.rating && p.rating.average >= filters.minRating
            );
        }

        // Filtro por condición
        if (filters.condition) {
            filtered = filtered.filter(p => p.condition === filters.condition);
        }

        // Filtro por disponibilidad
        if (filters.availability) {
            filtered = filtered.filter(p => p.availability === filters.availability);
        }

        // Filtro por rango de precio (considerando descuentos)
        filtered = filtered.filter(p => {
            const finalPrice = p.finalPrice || p.price;
            return finalPrice >= filters.priceRange.min && finalPrice <= filters.priceRange.max;
        });

        setFilteredProducts(filtered);
    }, [products, filters]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value === 'price-asc') {
            setSortBy('price');
            setOrder('asc');
        } else if (value === 'price-desc') {
            setSortBy('price');
            setOrder('desc');
        } else if (value === 'name-asc') {
            setSortBy('name');
            setOrder('asc');
        } else {
            setSortBy('createdAt');
            setOrder('desc');
        }
    };

    return (
        <>
            <SEO 
                title="Tienda - Todos los Productos"
                description="Explora nuestro catálogo completo de electrodomésticos. Filtra por categoría, marca, precio y más. Envío gratis."
                keywords="tienda electrodomésticos, catálogo, comprar online, ofertas"
            />
            {/* Header */}
            <div className='bg-gradient-to-r from-secondary to-dark text-white py-8'>
                <Container>
                    <h1 className='text-3xl md:text-4xl font-bold text-center'>
                        Nuestros <span className='text-primary'>Productos</span>
                    </h1>
                    <p className='text-center text-gray-300 mt-2'>
                        Encuentra los mejores electrodomésticos
                    </p>
                </Container>
            </div>

            <Container>
                <div className='my-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                        {/* Sidebar de Filtros */}
                        <div className='lg:col-span-1'>
                            <FilterSidebar 
                                onFilterChange={setFilters}
                                currentFilters={filters}
                            />
                        </div>

                        {/* Productos */}
                        <div className='lg:col-span-3'>
                            {/* Filtros y Ordenar */}
                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                                <div>
                                    <p className='text-gray-600'>
                                        {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                
                                <div className='flex items-center gap-2'>
                                    <label htmlFor='sort' className='text-gray-600'>
                                        Ordenar por:
                                    </label>
                                    <select
                                        id='sort'
                                        onChange={handleSortChange}
                                        className='border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:outline-none'
                                    >
                                        <option value='createdAt-desc'>Más reciente</option>
                                        <option value='price-asc'>Precio: menor a mayor</option>
                                        <option value='price-desc'>Precio: mayor a menor</option>
                                        <option value='name-asc'>Nombre: A-Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading */}
                            {loading && (
                                <div className='text-center py-12'>
                                    <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '48px'}}>
                                        progress_activity
                                    </span>
                                    <p className='text-gray-600 mt-4'>Cargando productos...</p>
                                </div>
                            )}

                            {/* Grid de Productos */}
                            {!loading && filteredProducts.length > 0 && (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            )}

                            {/* No hay productos */}
                            {!loading && filteredProducts.length === 0 && (
                                <div className='text-center py-12'>
                                    <span className='material-symbols-outlined text-gray-300' style={{fontSize: '80px'}}>
                                        inventory_2
                                    </span>
                                    <p className='text-gray-600 mt-4 text-lg'>No hay productos que coincidan con los filtros</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.product.products,
    loading: state.product.loading
});

export default connect(mapStateToProps, { getProducts })(Shop);

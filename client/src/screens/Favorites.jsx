import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from '../components/container/Container';
import ProductCard from '../components/products/ProductCard';
import { clearFavorites } from '../data/reducers/favorites';

const Favorites = ({ favorites, clearFavorites }) => {
    const handleClearAll = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
            clearFavorites();
        }
    };

    return (
        <>
            {/* Header */}
            <div className='bg-gradient-to-r from-secondary to-blue-900 text-white py-12'>
                <Container>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-4xl font-bold mb-2'>Mis Favoritos</h1>
                            <p className='text-blue-200'>
                                {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                            </p>
                        </div>
                        {favorites.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2'
                            >
                                <span className='material-symbols-outlined'>delete</span>
                                Limpiar Todo
                            </button>
                        )}
                    </div>
                </Container>
            </div>

            {/* Contenido */}
            <Container>
                <div className='py-12'>
                    {favorites.length === 0 ? (
                        <div className='text-center py-20'>
                            <span className='material-symbols-outlined text-gray-300' style={{fontSize: '120px'}}>
                                favorite_border
                            </span>
                            <h2 className='text-2xl font-bold text-gray-700 mt-4 mb-2'>
                                No tienes productos favoritos
                            </h2>
                            <p className='text-gray-500 mb-8'>
                                Explora nuestro catálogo y guarda los productos que te interesen
                            </p>
                            <Link
                                to='/shop'
                                className='inline-flex items-center gap-2 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded transition-colors'
                            >
                                <span className='material-symbols-outlined'>storefront</span>
                                Ver Productos
                            </Link>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {favorites.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

const mapStateToProps = (state) => ({
    favorites: state.favorites.favorites
});

export default connect(mapStateToProps, { clearFavorites })(Favorites);

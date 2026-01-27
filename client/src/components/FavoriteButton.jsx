import React from 'react';
import { connect } from 'react-redux';
import { addFavorite, removeFavorite } from '../data/reducers/favorites';

const FavoriteButton = ({ product, favorites, addFavorite, removeFavorite, className = '' }) => {
    const isFavorite = favorites.some(item => item._id === product._id);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isFavorite) {
            removeFavorite(product._id);
        } else {
            addFavorite(product);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-400 hover:text-red-500'
            } ${className}`}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
        </button>
    );
};

const mapStateToProps = (state) => ({
    favorites: state.favorites.favorites
});

export default connect(mapStateToProps, { addFavorite, removeFavorite })(FavoriteButton);

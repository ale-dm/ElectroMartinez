import { toast } from 'react-toastify';

// Types
const ADD_FAVORITE = 'ADD_FAVORITE';
const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
const CLEAR_FAVORITES = 'CLEAR_FAVORITES';
const LOAD_FAVORITES = 'LOAD_FAVORITES';

// Obtener favoritos del localStorage
const getFavoritesFromStorage = () => {
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
        return [];
    }
};

// Initial State
const initialState = {
    favorites: getFavoritesFromStorage(),
};

// Reducers
export default function favoritesReducer(state = initialState, action) {
    const { type, payload } = action;
    
    switch (type) {
        case ADD_FAVORITE:
            const newFavorites = [...state.favorites, payload];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return {
                ...state,
                favorites: newFavorites
            };
            
        case REMOVE_FAVORITE:
            const filteredFavorites = state.favorites.filter(
                item => item._id !== payload
            );
            localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
            return {
                ...state,
                favorites: filteredFavorites
            };
            
        case CLEAR_FAVORITES:
            localStorage.removeItem('favorites');
            return {
                ...state,
                favorites: []
            };
            
        case LOAD_FAVORITES:
            return {
                ...state,
                favorites: getFavoritesFromStorage()
            };
            
        default:
            return state;
    }
}

// Actions
export const addFavorite = (product) => (dispatch, getState) => {
    const { favorites } = getState().favorites;
    
    // Verificar si ya existe
    const exists = favorites.find(item => item._id === product._id);
    
    if (exists) {
        toast.info('Este producto ya está en favoritos');
        return;
    }
    
    dispatch({
        type: ADD_FAVORITE,
        payload: product
    });
    
    toast.success('Producto agregado a favoritos');
};

export const removeFavorite = (productId) => (dispatch) => {
    dispatch({
        type: REMOVE_FAVORITE,
        payload: productId
    });
    
    toast.info('Producto eliminado de favoritos');
};

export const clearFavorites = () => (dispatch) => {
    dispatch({
        type: CLEAR_FAVORITES
    });
    
    toast.success('Favoritos eliminados');
};

export const loadFavorites = () => (dispatch) => {
    dispatch({
        type: LOAD_FAVORITES
    });
};

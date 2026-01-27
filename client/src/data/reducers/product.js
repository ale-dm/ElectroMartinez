import axios from 'axios';
import { toast } from 'react-toastify';
import { URLDevelopment } from '../../helpers/URL';

// Types
const GET_PRODUCTS = 'GET_PRODUCTS';
const GET_PRODUCT = 'GET_PRODUCT';
const FILTER_PRODUCTS = 'FILTER_PRODUCTS';
const SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
const SET_LOADING = 'SET_LOADING';
const PRODUCT_ERROR = 'PRODUCT_ERROR';
const CLEAR_PRODUCT = 'CLEAR_PRODUCT';

// Initial State
const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 12,
};

// Reducers
export default function productReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_PRODUCTS:
            return {
                ...state,
                products: payload.products,
                total: payload.total,
                loading: false,
                error: null
            };
        case GET_PRODUCT:
            return {
                ...state,
                product: payload,
                loading: false,
                error: null
            };
        case FILTER_PRODUCTS:
        case SEARCH_PRODUCTS:
            return {
                ...state,
                products: payload,
                loading: false,
                error: null
            };
        case CLEAR_PRODUCT:
            return {
                ...state,
                product: null
            };
        case PRODUCT_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
}

// Actions
export const getProducts = (sortBy = 'createdAt', order = 'desc', limit = 12) => async (dispatch) => {
    dispatch({ type: SET_LOADING });

    try {
        const res = await axios.get(`${URLDevelopment}/api/product/list?sortBy=${sortBy}&order=${order}&limit=${limit}`);
        
        dispatch({
            type: GET_PRODUCTS,
            payload: {
                products: res.data,
                total: res.data.length
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        dispatch({
            type: PRODUCT_ERROR,
            payload: error.message
        });
        toast.error('Error al cargar productos');
    }
};

export const getProduct = (productId) => async (dispatch) => {
    dispatch({ type: SET_LOADING });

    try {
        const res = await axios.get(`${URLDevelopment}/api/product/${productId}`);
        
        dispatch({
            type: GET_PRODUCT,
            payload: res.data
        });
    } catch (error) {
        console.error('Get product error:', error);
        dispatch({
            type: PRODUCT_ERROR,
            payload: error.message
        });
        toast.error('Error al cargar el producto');
    }
};

export const filterProducts = (filters) => async (dispatch) => {
    dispatch({ type: SET_LOADING });

    try {
        const res = await axios.post(`${URLDevelopment}/api/product/filter`, filters);
        
        dispatch({
            type: FILTER_PRODUCTS,
            payload: res.data
        });
    } catch (error) {
        console.error('Filter products error:', error);
        dispatch({
            type: PRODUCT_ERROR,
            payload: error.message
        });
        toast.error('Error al filtrar productos');
    }
};

export const searchProducts = (searchTerm) => async (dispatch) => {
    dispatch({ type: SET_LOADING });

    try {
        const res = await axios.get(`${URLDevelopment}/api/product/search?search=${searchTerm}`);
        
        dispatch({
            type: SEARCH_PRODUCTS,
            payload: res.data
        });
    } catch (error) {
        console.error('Search products error:', error);
        dispatch({
            type: PRODUCT_ERROR,
            payload: error.message
        });
        toast.error('Error al buscar productos');
    }
};

export const clearProduct = () => (dispatch) => {
    dispatch({ type: CLEAR_PRODUCT });
};

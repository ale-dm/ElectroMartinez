import axios from 'axios';
import { toast } from 'react-toastify';
import setAuthToken from '../../helpers/setAuthToken';
import { URLDevelopment } from '../../helpers/URL';

// Types
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAIL = 'REGISTER_FAIL';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const USER_LOADED = 'USER_LOADED';
const AUTH_ERROR = 'AUTH_ERROR';
const LOGOUT = 'LOGOUT';
const AUTH_SET_LOADING = 'AUTH_SET_LOADING';

// Initial State
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
};

// Reducers
export default function authReducer(state = initialState, action) {
    const { type, payload } = action;
    
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                user: payload,
                isAuthenticated: true,
                loading: false
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            };
        case AUTH_SET_LOADING:
            return {
                ...state,
                loading: true
            };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
}

// Actions
export const loadUser = () => async (dispatch) => {
    console.log('🔄 loadUser ejecutándose...');
    console.log('Token en localStorage:', localStorage.token);
    
    if (localStorage.token) {
        setAuthToken(localStorage.token);
        console.log('✅ Token establecido en axios headers');
    } else {
        console.log('❌ No hay token, estableciendo AUTH_ERROR');
        // Si no hay token, establecer estado no autenticado
        dispatch({
            type: AUTH_ERROR
        });
        return;
    }

    try {
        console.log('📡 Haciendo petición a /api/user...');
        const res = await axios.get(`${URLDevelopment}/api/user`);
        console.log('✅ Usuario cargado:', res.data);
        console.log('📤 Dispatching USER_LOADED...');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
        console.log('✅ USER_LOADED dispatched');
    } catch (error) {
        console.error('❌ Error al cargar usuario:', error);
        console.log('📤 Dispatching AUTH_ERROR...');
        dispatch({
            type: AUTH_ERROR
        });
        console.log('✅ AUTH_ERROR dispatched');
    }
};

export const register = ({ name, email, password }) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ name, email, password });

    dispatch({ type: AUTH_SET_LOADING });

    try {
        const res = await axios.post(`${URLDevelopment}/api/user/register`, body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        console.error('Register error:', err);
        
        if (err.response && err.response.data && err.response.data.errors) {
            err.response.data.errors.forEach(error => toast.error(error.msg));
        } else if (err.message) {
            toast.error('Error de conexión. Verifica que el servidor esté funcionando.');
        } else {
            toast.error('Error al registrar. Intenta nuevamente.');
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }
};

export const login = ({ email, password }) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ email, password });

    dispatch({ type: AUTH_SET_LOADING });

    try {
        const res = await axios.post(`${URLDevelopment}/api/user/login`, body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        console.error('Login error:', err);
        
        if (err.response && err.response.data && err.response.data.errors) {
            err.response.data.errors.forEach(error => toast.error(error.msg));
        } else if (err.message) {
            toast.error('Error de conexión. Verifica que el servidor esté funcionando.');
        } else {
            toast.error('Error al iniciar sesión. Intenta nuevamente.');
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
};

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};

import { createSlice } from '@reduxjs/toolkit';

// Cargar carrito desde localStorage
const loadCartFromStorage = () => {
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            return JSON.parse(cartData);
        }
    } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
    }
    return [];
};

// Guardar carrito en localStorage
const saveCartToStorage = (items) => {
    try {
        localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
        console.error('Error al guardar carrito en localStorage:', error);
    }
};

const initialState = {
    items: loadCartFromStorage(),
    isDrawerOpen: false
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item._id === product._id);

            if (existingItem) {
                // Si el producto ya existe, incrementar cantidad
                existingItem.quantity += product.quantity || 1;
                // Verificar que no exceda el stock disponible
                if (existingItem.quantity > product.stock) {
                    existingItem.quantity = product.stock;
                }
            } else {
                // Agregar nuevo producto al carrito
                state.items.push({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images.length > 0 ? product.images[0].url : null,
                    stock: product.quantity || product.stock || 0,
                    quantity: product.quantity || 1,
                    brand: product.brand || ''
                });
            }

            saveCartToStorage(state.items);
        },

        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item._id !== productId);
            saveCartToStorage(state.items);
        },

        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item._id === productId);

            if (item) {
                // Asegurar que la cantidad esté entre 1 y el stock disponible
                item.quantity = Math.max(1, Math.min(quantity, item.stock));
                saveCartToStorage(state.items);
            }
        },

        clearCart: (state) => {
            state.items = [];
            saveCartToStorage(state.items);
        },

        toggleDrawer: (state, action) => {
            state.isDrawerOpen = action.payload !== undefined ? action.payload : !state.isDrawerOpen;
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleDrawer } = cartSlice.actions;

// Selectores
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => {
    return state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
export const selectCartItemsCount = (state) => {
    return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};
export const selectIsDrawerOpen = (state) => state.cart.isDrawerOpen;

export default cartSlice.reducer;

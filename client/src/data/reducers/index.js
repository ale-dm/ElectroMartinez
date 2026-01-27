import { combineReducers } from 'redux';
import auth from './auth';
import product from './product';
import favorites from './favorites';
import cart from './cart';

export default combineReducers({
    auth,
    product,
    favorites,
    cart
});

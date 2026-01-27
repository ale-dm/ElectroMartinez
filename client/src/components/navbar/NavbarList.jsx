import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import Button from '../buttons/Button';
import NavItem from './NavItem';
import NotificationBell from './NotificationBell';
import { logout } from '../../data/reducers/auth';
import { selectCartItemsCount, toggleDrawer } from '../../data/reducers/cart';

const NavbarList = ({ logout, isAuth, user, favorites, cartItemsCount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const isActive = (path) => {
        if (location.pathname === path) {
            return 'text-primary';
        } else {
            return '';
        }
    };

    const handleCartClick = () => {
        dispatch(toggleDrawer(true));
    };

    return (
        <ul className='font-bold flex-wrap flex md:mr-5 flex-col md:flex-row text-center gap-4'>
            <NavItem link='/' name='Inicio' listStyle={`${isActive('/') || 'text-white hover:text-primary'}`} />
            <NavItem link='/shop' name='Productos' listStyle={`${isActive('/shop') || 'text-white hover:text-primary'}`} />
            
            {/* Favoritos con badge - Oculto para admin */}
            {!(isAuth && user && user.role === 1) && (
                <li className='relative hover:text-primary animate px-3 py-2 rounded-md text-white hover:text-primary'>
                    <Link to='/favoritos' className='flex items-center gap-1'>
                        <span className='material-symbols-outlined' style={{fontSize: '20px'}}>favorite</span>
                        Favoritos
                    </Link>
                    {favorites.length > 0 && (
                        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                            {favorites.length}
                        </span>
                    )}
                </li>
            )}
            
            {/* Notificaciones */}
            {isAuth && (
                <li>
                    <NotificationBell />
                </li>
            )}
            
            {/* Carrito con badge - Oculto para admin */}
            {!(isAuth && user && user.role === 1) && (
                <li className='relative'>
                    <button
                        onClick={handleCartClick}
                        className='flex items-center gap-2 text-white hover:text-primary transition-colors px-4 py-2'
                    >
                        <span className='material-symbols-outlined' style={{fontSize: '24px'}}>
                            shopping_cart
                        </span>
                        <span className='hidden md:inline'>Carrito</span>
                        {cartItemsCount > 0 && (
                            <span className='absolute -top-1 -right-1 md:top-0 md:right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                                {cartItemsCount}
                            </span>
                        )}
                    </button>
                </li>
            )}

            {/* Admin link */}
            {isAuth && user && user.role === 1 && (
                <NavItem link='/dashboard/admin' name='Admin' listStyle={`${isActive('/dashboard/admin') || 'text-white hover:text-primary'}`} />
            )}

            {/* Mi Cuenta - Oculto para admin */}
            {isAuth && user && user.role !== 1 && (
                <Button
                    title='Mi Cuenta'
                    moreStyle='hover:text-primary'
                    isButton={false}
                    href='/dashboard/user'
                />
            )}

            {/* Salir */}
            {isAuth && (
                <Button
                    title='Salir'
                    moreStyle='text-white hover:text-primary bg-transparent border border-primary px-4 py-2 rounded'
                    action={() => {
                        logout();
                        navigate('/');
                    }}
                />
            )}

            {/* Login/Register */}
            {!isAuth && (
                <>
                    <Button
                        title='Login'
                        moreStyle='hover:text-primary'
                        isButton={false}
                        href='/login'
                    />
                    <Button
                        title='Register'
                        moreStyle='hover:text-primary'
                        isButton={false}
                        href='/register'
                    />
                </>
            )}
        </ul>
    );
};

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuthenticated,
    user: state.auth.user,
    favorites: state.favorites.favorites,
    cartItemsCount: selectCartItemsCount(state)
});

export default connect(mapStateToProps, { logout })(NavbarList);

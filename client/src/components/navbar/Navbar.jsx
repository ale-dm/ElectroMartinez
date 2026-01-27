import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../container/Container';
import NavbarList from './NavbarList';
import NavbarToggle from './NavbarToggle';
import SearchBar from './SearchBar';

const Navbar = () => {
    const [active, setActive] = useState(false);

    const menuState = () => {
        setActive(!active);
    };

    return (
        <nav className='navbar w-full px-4 md:px-6 py-4'>
            <Container>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    {/* Logo y Búsqueda */}
                    <div className='flex items-center justify-between w-full md:w-auto gap-4'>
                        <Link to='/' className='flex items-center gap-3 animate hover:scale-105 transition-transform'>
                            <div className='w-10 h-10 md:w-12 md:h-12 border-2 border-primary rounded-full flex items-center justify-center'>
                                <div className='w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full'></div>
                            </div>
                            <div>
                                <h1 className='text-xl md:text-2xl font-bold'>
                                    <span className='text-primary'>Electro</span>
                                    <span className='text-white'>Martinez</span>
                                </h1>
                                <p className='text-xs text-gray-400 hidden md:block'>Electrodomésticos y más</p>
                            </div>
                        </Link>

                        <div className='md:hidden'>
                            <NavbarToggle active={active} menuState={menuState} />
                        </div>
                    </div>

                    {/* Barra de búsqueda mejorada */}
                    <SearchBar />

                    {/* Menu de navegación */}
                    <div className='hidden md:flex'>
                        <NavbarList />
                    </div>
                </div>

                {/* Menu móvil */}
                <div className={`${active ? 'flex' : 'hidden'} md:hidden mt-4 pt-4 border-t border-gray-600`}>
                    <NavbarList />
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;

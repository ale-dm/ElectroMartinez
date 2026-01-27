import React from 'react';

const NavbarToggle = ({ active, menuState }) => {
    return (
        <div className='block md:hidden'>
            <button
                className={`focus:outline-none ${active ? 'menu-icon--isActive' : ''} ml-4 self-center cursor-pointer`}
                onClick={menuState}
            >
                <div className='w-6 h-1 bg-gray-700 mb-1'></div>
                <div className='w-6 h-1 bg-gray-700 mb-1'></div>
                <div className='w-6 h-1 bg-gray-700'></div>
            </button>
        </div>
    );
};

export default NavbarToggle;

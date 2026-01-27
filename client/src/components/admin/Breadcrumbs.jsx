import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
    return (
        <div className='bg-gray-100 py-4 mb-6'>
            <div className='flex items-center gap-2 text-sm'>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.href ? (
                            <Link 
                                to={item.href} 
                                className='text-gray-600 hover:text-primary transition-colors'
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className='text-secondary font-medium'>{item.label}</span>
                        )}
                        {index < items.length - 1 && (
                            <span className='material-symbols-outlined text-gray-400' style={{fontSize: '16px'}}>
                                chevron_right
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Breadcrumbs;

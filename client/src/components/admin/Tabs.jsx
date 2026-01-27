import React, { useState } from 'react';

const Tabs = ({ tabs, children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            {/* Pestañas */}
            <div className='border-b border-gray-200 mb-6'>
                <div className='flex gap-4 overflow-x-auto'>
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type='button'
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                                activeTab === index
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-600 hover:text-secondary'
                            }`}
                        >
                            <span className='flex items-center gap-2'>
                                {tab.icon && (
                                    <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                        {tab.icon}
                                    </span>
                                )}
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido de la pestaña activa */}
            <div>
                {React.Children.map(children, (child, index) => (
                    <div className={activeTab === index ? 'block' : 'hidden'}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;

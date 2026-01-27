import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Eliminar', cancelText = 'Cancelar' }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4'>
                {/* Icono de advertencia */}
                <div className='flex items-center justify-center mb-4'>
                    <div className='bg-red-100 rounded-full p-4'>
                        <span className='material-symbols-outlined text-red-600' style={{fontSize: '48px'}}>
                            warning
                        </span>
                    </div>
                </div>

                {/* Título */}
                <h3 className='text-xl font-bold text-secondary text-center mb-2'>
                    {title}
                </h3>

                {/* Mensaje */}
                <p className='text-gray-600 text-center mb-6'>
                    {message}
                </p>

                {/* Botones */}
                <div className='flex gap-3'>
                    <button
                        onClick={onClose}
                        className='flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors'
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className='flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors'
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

import React, { useState } from 'react';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';
import { toast } from 'react-toastify';

const RecalculateDiscounts = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleRecalculate = async () => {
        if (!window.confirm('¿Estás seguro de recalcular los descuentos de todos los productos? Esto actualizará isOnSale y finalPrice según la configuración actual.')) {
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            const res = await axios.post(
                `${URLDevelopment}/api/product/recalculate-discounts`,
                {},
                config
            );

            setResult(res.data);
            toast.success(res.data.message);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.error || 'Error al recalcular descuentos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center gap-3 mb-4'>
                <span className='material-symbols-outlined text-orange-600' style={{fontSize: '32px'}}>
                    refresh
                </span>
                <div>
                    <h3 className='text-xl font-bold text-secondary'>Recalcular Descuentos</h3>
                    <p className='text-sm text-gray-600'>Actualiza isOnSale y finalPrice de todos los productos</p>
                </div>
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
                <h4 className='font-bold text-blue-900 mb-2 flex items-center gap-2'>
                    <span className='material-symbols-outlined' style={{fontSize: '18px'}}>info</span>
                    ¿Cuándo usar esta herramienta?
                </h4>
                <ul className='text-sm text-blue-800 space-y-1'>
                    <li>• Si configuraste descuentos pero no se ven en la tienda</li>
                    <li>• Después de actualizar el código del modelo de productos</li>
                    <li>• Para sincronizar descuentos después de cambios masivos</li>
                    <li>• Si los precios finales no se calculan correctamente</li>
                </ul>
            </div>

            <button
                onClick={handleRecalculate}
                disabled={loading}
                className='w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
                <span className='material-symbols-outlined' style={{fontSize: '24px'}}>
                    {loading ? 'progress_activity' : 'sync'}
                </span>
                {loading ? 'Recalculando...' : 'Recalcular Todos los Productos'}
            </button>

            {result && (
                <div className='mt-4 bg-green-50 border border-green-200 rounded-lg p-4'>
                    <div className='flex items-center gap-2 text-green-900'>
                        <span className='material-symbols-outlined text-green-600'>check_circle</span>
                        <div>
                            <p className='font-bold'>{result.message}</p>
                            <p className='text-sm'>{result.updated} productos procesados correctamente</p>
                        </div>
                    </div>
                </div>
            )}

            <div className='mt-4 text-xs text-gray-500'>
                <strong>Nota técnica:</strong> Este proceso recalcula los campos isOnSale y finalPrice 
                basándose en discount.active, discount.percentage y las fechas configuradas.
            </div>
        </div>
    );
};

export default RecalculateDiscounts;

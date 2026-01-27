import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { URLDevelopment } from '../../helpers/URL';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, couponId: null, couponCode: '' });
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        type: 'percentage',
        minPurchase: '',
        maxDiscount: '',
        expiryDate: '',
        usageLimit: '',
        description: '',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    useEffect(() => {
        filterCoupons();
    }, [coupons, searchTerm]);

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${URLDevelopment}/api/coupon/admin`, {
                headers: { 'x-auth-token': token }
            });
            setCoupons(response.data.coupons || []);
        } catch (error) {
            console.error('Error al cargar cupones:', error);
            toast.error('Error al cargar cupones');
        } finally {
            setLoading(false);
        }
    };

    const filterCoupons = () => {
        let filtered = [...coupons];

        if (searchTerm) {
            filtered = filtered.filter(coupon =>
                coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCoupons(filtered);
    };

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData({
            ...formData,
            [name]: inputType === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            
            const couponData = {
                code: formData.code.toUpperCase(),
                discount: parseFloat(formData.discount),
                type: formData.type,
                minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
                maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                expiryDate: formData.expiryDate,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                description: formData.description,
                isActive: formData.isActive
            };

            if (editingCoupon) {
                await axios.put(
                    `${URLDevelopment}/api/coupon/admin/${editingCoupon._id}`,
                    couponData,
                    { headers: { 'x-auth-token': token } }
                );
                toast.success('Cupón actualizado correctamente');
            } else {
                await axios.post(
                    `${URLDevelopment}/api/coupon/admin`,
                    couponData,
                    { headers: { 'x-auth-token': token } }
                );
                toast.success('Cupón creado correctamente');
            }

            setShowModal(false);
            resetForm();
            fetchCoupons();
        } catch (error) {
            console.error('Error al guardar cupón:', error);
            toast.error(error.response?.data?.message || 'Error al guardar el cupón');
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discount: coupon.discount,
            type: coupon.type,
            minPurchase: coupon.minPurchase || '',
            maxDiscount: coupon.maxDiscount || '',
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            usageLimit: coupon.usageLimit || '',
            description: coupon.description || '',
            isActive: coupon.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (couponId, couponCode) => {
        setDeleteModal({ isOpen: true, couponId, couponCode });
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${URLDevelopment}/api/coupon/admin/${deleteModal.couponId}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Cupón eliminado correctamente');
            fetchCoupons();
            setDeleteModal({ isOpen: false, couponId: null, couponCode: '' });
        } catch (error) {
            console.error('Error al eliminar cupón:', error);
            toast.error('Error al eliminar el cupón');
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discount: '',
            type: 'percentage',
            minPurchase: '',
            maxDiscount: '',
            expiryDate: '',
            usageLimit: '',
            description: '',
            isActive: true
        });
        setEditingCoupon(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className='flex'>
                <AdminSidebar />
                <div className='flex-1 p-8'>
                    <div className='text-center py-20'>
                        <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                            progress_activity
                        </span>
                        <p className='text-gray-600 mt-4 text-lg'>Cargando cupones...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex bg-gray-50 min-h-screen'>
            <AdminSidebar />
            
            <div className='flex-1 p-8'>
                <Breadcrumbs items={[
                    { label: 'Dashboard', href: '/dashboard/admin' },
                    { label: 'Cupones' }
                ]} />

                <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-3xl font-bold text-secondary'>Gestión de Cupones</h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className='bg-primary hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <span className='material-symbols-outlined'>add</span>
                            Nuevo Cupón
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className='mb-6 flex gap-4'>
                        <div className='flex-1'>
                            <input
                                type='text'
                                placeholder='Buscar por código o descripción...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            />
                        </div>
                    </div>

                    {/* Tabla de Cupones */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full'>
                            <thead className='bg-secondary text-white'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Código
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Descuento
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Tipo
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Compra Mín.
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Usos
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Expira
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Estado
                                    </th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {filteredCoupons.length === 0 ? (
                                    <tr>
                                        <td colSpan='8' className='px-6 py-12 text-center text-gray-500'>
                                            <span className='material-symbols-outlined text-gray-300' style={{fontSize: '80px'}}>
                                                sell
                                            </span>
                                            <p className='mt-4 text-lg'>No se encontraron cupones</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCoupons.map((coupon) => (
                                        <tr key={coupon._id} className='hover:bg-gray-50 transition-colors'>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='font-semibold text-primary text-base'>{coupon.code}</div>
                                                {coupon.description && (
                                                    <div className='text-sm text-gray-500 mt-1'>{coupon.description}</div>
                                                )}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className='font-semibold text-green-600 text-base'>
                                                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `${coupon.discount}€`}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    coupon.type === 'percentage' 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {coupon.type === 'percentage' ? 'Porcentaje' : 'Fijo'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-gray-700'>
                                                {coupon.minPurchase ? `${coupon.minPurchase}€` : '-'}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-gray-700'>
                                                <span className='font-medium'>{coupon.usedCount}</span> 
                                                {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-gray-700'>
                                                {new Date(coupon.expiryDate).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    coupon.isActive 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {coupon.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='flex items-center gap-2'>
                                                    <button
                                                        onClick={() => handleEdit(coupon)}
                                                        className='text-blue-600 hover:text-blue-800 transition-colors p-1'
                                                        title='Editar'
                                                    >
                                                        <span className='material-symbols-outlined'>edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon._id, coupon.code)}
                                                        className='text-red-600 hover:text-red-800 transition-colors p-1'
                                                        title='Eliminar'
                                                    >
                                                        <span className='material-symbols-outlined'>delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de confirmación de eliminación */}
                <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, couponId: null, couponCode: '' })}
                    onConfirm={confirmDelete}
                    title='Eliminar Cupón'
                    message={`¿Estás seguro de que quieres eliminar el cupón "${deleteModal.couponCode}"? Esta acción no se puede deshacer.`}
                />

                {/* Modal de Crear/Editar */}
                {showModal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
                        <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                            <div className='p-6'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className='text-2xl font-bold text-secondary'>
                                        {editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}
                                    </h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className='text-gray-500 hover:text-gray-700'
                                    >
                                        <span className='material-symbols-outlined'>close</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Código del Cupón *
                                            </label>
                                            <input
                                                type='text'
                                                name='code'
                                                value={formData.code}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none uppercase'
                                                placeholder='VERANO2024'
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Tipo de Descuento *
                                            </label>
                                            <select
                                                name='type'
                                                value={formData.type}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                            >
                                                <option value='percentage'>Porcentaje (%)</option>
                                                <option value='fixed'>Cantidad Fija (€)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Descuento * {formData.type === 'percentage' ? '(%)' : '(€)'}
                                            </label>
                                            <input
                                                type='number'
                                                name='discount'
                                                value={formData.discount}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                placeholder={formData.type === 'percentage' ? '10' : '15.00'}
                                                min='0'
                                                step={formData.type === 'percentage' ? '1' : '0.01'}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Compra Mínima (€)
                                            </label>
                                            <input
                                                type='number'
                                                name='minPurchase'
                                                value={formData.minPurchase}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                placeholder='0'
                                                min='0'
                                                step='0.01'
                                            />
                                        </div>

                                        {formData.type === 'percentage' && (
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Descuento Máximo (€)
                                                </label>
                                                <input
                                                    type='number'
                                                    name='maxDiscount'
                                                    value={formData.maxDiscount}
                                                    onChange={handleChange}
                                                    className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                    placeholder='Sin límite'
                                                    min='0'
                                                    step='0.01'
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Fecha de Expiración *
                                            </label>
                                            <input
                                                type='date'
                                                name='expiryDate'
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Límite de Usos
                                            </label>
                                            <input
                                                type='number'
                                                name='usageLimit'
                                                value={formData.usageLimit}
                                                onChange={handleChange}
                                                className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                                placeholder='Sin límite'
                                                min='1'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Descripción
                                        </label>
                                        <textarea
                                            name='description'
                                            value={formData.description}
                                            onChange={handleChange}
                                            className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                            placeholder='Descuento de verano para todos los productos'
                                            rows='3'
                                        />
                                    </div>

                                    <div className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            name='isActive'
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className='w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded'
                                        />
                                        <label className='ml-2 text-sm font-medium text-gray-700'>
                                            Cupón Activo
                                        </label>
                                    </div>

                                    <div className='flex justify-end gap-3 pt-4'>
                                        <button
                                            type='button'
                                            onClick={handleCloseModal}
                                            className='px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type='submit'
                                            className='px-6 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg font-bold transition-colors'
                                        >
                                            {editingCoupon ? 'Actualizar' : 'Crear'} Cupón
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;

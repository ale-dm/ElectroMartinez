import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, brandId: null, brandName: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        order: 0,
        isActive: true,
        image: null
    });

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        filterBrands();
    }, [brands, searchTerm]);

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/brand/all`);
            setBrands(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            toast.error('Error al cargar las marcas');
            setLoading(false);
        }
    };

    const filterBrands = () => {
        let filtered = [...brands];

        if (searchTerm) {
            filtered = filtered.filter(brand =>
                brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredBrands(filtered);
    };

    const handleOpenModal = (brand = null) => {
        if (brand) {
            setEditingBrand(brand);
            setFormData({
                name: brand.name,
                description: brand.description || '',
                website: brand.website || '',
                order: brand.order || 0,
                isActive: brand.isActive,
                image: brand.image
            });
            
            if (brand.image && brand.image.url) {
                setImagePreview(brand.image.url);
            } else {
                setImagePreview(null);
            }
            setImageFile(null);
        } else {
            setEditingBrand(null);
            setFormData({
                name: '',
                description: '',
                website: '',
                order: 0,
                isActive: true,
                image: null
            });
            setImagePreview(null);
            setImageFile(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBrand(null);
        setFormData({
            name: '',
            description: '',
            website: '',
            order: 0,
            isActive: true,
            image: null
        });
        setImagePreview(null);
        setImageFile(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('website', formData.website);
            data.append('order', formData.order);
            data.append('isActive', formData.isActive);
            
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingBrand) {
                await axios.put(
                    `${URLDevelopment}/api/brand/${editingBrand._id}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'x-auth-token': token
                        }
                    }
                );
                toast.success('Marca actualizada correctamente');
            } else {
                await axios.post(
                    `${URLDevelopment}/api/brand`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'x-auth-token': token
                        }
                    }
                );
                toast.success('Marca creada correctamente');
            }

            fetchBrands();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar marca:', error);
            toast.error(error.response?.data?.error || 'Error al guardar la marca');
        }
    };

    const handleDelete = async (brandId, brandName) => {
        setDeleteModal({ isOpen: true, brandId, brandName });
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${URLDevelopment}/api/brand/${deleteModal.brandId}`,
                {
                    headers: { 'x-auth-token': token }
                }
            );
            toast.success('Marca eliminada correctamente');
            fetchBrands();
            setDeleteModal({ isOpen: false, brandId: null, brandName: '' });
        } catch (error) {
            console.error('Error al eliminar marca:', error);
            toast.error(error.response?.data?.error || 'Error al eliminar la marca');
        }
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
                        <p className='text-gray-600 mt-4 text-lg'>Cargando marcas...</p>
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
                    { label: 'Marcas' }
                ]} />

                <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-3xl font-bold text-secondary'>Gestión de Marcas</h1>
                        <button
                            onClick={() => handleOpenModal()}
                            className='bg-primary hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <span className='material-symbols-outlined'>add</span>
                            Nueva Marca
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className='mb-6 flex gap-4'>
                        <div className='flex-1'>
                            <input
                                type='text'
                                placeholder='Buscar por nombre o descripción...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            />
                        </div>
                    </div>

                    {/* Tabla de Marcas */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full'>
                            <thead className='bg-secondary text-white'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                        Marca
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                        Descripción
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                        Website
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                        Orden
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                        Estado
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {filteredBrands.length === 0 ? (
                                    <tr>
                                        <td colSpan='6' className='px-6 py-12 text-center text-gray-500'>
                                            <span className='material-symbols-outlined text-gray-300' style={{fontSize: '80px'}}>
                                                category
                                            </span>
                                            <p className='mt-4 text-lg'>No se encontraron marcas</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBrands.map((brand) => (
                                        <tr key={brand._id} className='hover:bg-gray-50 transition-colors'>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='flex items-center gap-3'>
                                                    {brand.image && brand.image.url ? (
                                                        <img
                                                            src={brand.image.url}
                                                            alt={brand.name}
                                                            className='w-12 h-12 object-cover rounded-lg'
                                                        />
                                                    ) : (
                                                        <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                            <span className='material-symbols-outlined text-gray-400'>
                                                                category
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className='font-medium text-gray-900'>{brand.name}</div>
                                                        <div className='text-sm text-gray-500'>{brand.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div className='text-sm text-gray-600 max-w-xs'>
                                                    {brand.description ? (
                                                        brand.description.length > 60
                                                            ? brand.description.substring(0, 60) + '...'
                                                            : brand.description
                                                    ) : (
                                                        <span className='text-gray-400 italic'>Sin descripción</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                {brand.website ? (
                                                    <a
                                                        href={brand.website}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='text-primary hover:underline text-sm'
                                                    >
                                                        Visitar
                                                    </a>
                                                ) : (
                                                    <span className='text-gray-400 italic text-sm'>-</span>
                                                )}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                                                    {brand.order}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    brand.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {brand.isActive ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                <button
                                                    onClick={() => handleOpenModal(brand)}
                                                    className='text-primary hover:text-yellow-700 mr-4 inline-flex items-center gap-1'
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '18px'}}>edit</span>
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand._id, brand.name)}
                                                    className='text-red-600 hover:text-red-900 inline-flex items-center gap-1'
                                                >
                                                    <span className='material-symbols-outlined' style={{fontSize: '18px'}}>delete</span>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-4 text-sm text-gray-600'>
                        Mostrando {filteredBrands.length} de {brands.length} marca{brands.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center'>
                            <h2 className='text-2xl font-bold text-secondary'>
                                {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className='text-gray-400 hover:text-gray-600 transition-colors'
                            >
                                <span className='material-symbols-outlined' style={{fontSize: '28px'}}>close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                            {/* Nombre */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Nombre <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                    required
                                    placeholder='Ej: Bosch, LG, Samsung...'
                                />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Descripción
                                </label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows='3'
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                    placeholder='Descripción de la marca...'
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Sitio Web
                                </label>
                                <input
                                    type='url'
                                    name='website'
                                    value={formData.website}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                    placeholder='https://www.ejemplo.com'
                                />
                            </div>

                            {/* Imagen */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Imagen / Logo
                                </label>
                                <div className='border-2 border-dashed border-gray-300 rounded-lg p-4'>
                                    {imagePreview ? (
                                        <div className='relative'>
                                            <img
                                                src={imagePreview}
                                                alt='Preview'
                                                className='w-full h-48 object-contain rounded-lg'
                                            />
                                            <button
                                                type='button'
                                                onClick={handleRemoveImage}
                                                className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors'
                                            >
                                                <span className='material-symbols-outlined' style={{fontSize: '20px'}}>delete</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='text-center'>
                                            <span className='material-symbols-outlined text-gray-400' style={{fontSize: '48px'}}>
                                                image
                                            </span>
                                            <p className='mt-2 text-sm text-gray-600'>
                                                Haz clic para subir una imagen
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageChange}
                                        className='mt-2 w-full'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                {/* Orden */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Orden
                                    </label>
                                    <input
                                        type='number'
                                        name='order'
                                        value={formData.order}
                                        onChange={handleChange}
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                        min='0'
                                    />
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Estado
                                    </label>
                                    <label className='flex items-center gap-2 mt-2'>
                                        <input
                                            type='checkbox'
                                            name='isActive'
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className='w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded'
                                        />
                                        <span className='text-sm text-gray-700'>Marca activa</span>
                                    </label>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className='flex justify-end gap-3 pt-4'>
                                <button
                                    type='button'
                                    onClick={handleCloseModal}
                                    className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    Cancelar
                                </button>
                                <button
                                    type='submit'
                                    className='px-6 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2'
                                >
                                    <span className='material-symbols-outlined' style={{fontSize: '20px'}}>save</span>
                                    {editingBrand ? 'Actualizar' : 'Crear'} Marca
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, brandId: null, brandName: '' })}
                onConfirm={confirmDelete}
                title='Eliminar Marca'
                message={`¿Estás seguro de que deseas eliminar la marca "${deleteModal.brandName}"?`}
                confirmText='Eliminar'
                cancelText='Cancelar'
            />
        </div>
    );
};

export default AdminBrands;

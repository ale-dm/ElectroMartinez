import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterParent, setFilterParent] = useState('root');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent: '',
        order: 0,
        isActive: true,
        image: null
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        filterCategories();
    }, [categories, searchTerm, filterParent]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/category/all`);
            setCategories(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            toast.error('Error al cargar las categorías');
            setLoading(false);
        }
    };

    const filterCategories = () => {
        let filtered = [...categories];

        // Filtro por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por tipo (raíz/subcategorías)
        if (filterParent === 'root') {
            filtered = filtered.filter(cat => !cat.parent);
        } else if (filterParent === 'sub') {
            filtered = filtered.filter(cat => cat.parent);
        }

        setFilteredCategories(filtered);
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                parent: category.parent?._id || '',
                order: category.order || 0,
                isActive: category.isActive !== undefined ? category.isActive : true,
                image: category.image || null
            });
            setImagePreview(category.image?.url || null);
            setImageFile(null);
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                parent: '',
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
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            parent: '',
            order: 0,
            isActive: true,
            image: null
        });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, image: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre de la categoría es obligatorio');
            return;
        }

        try {
            const form = new FormData();
            form.append('name', formData.name);
            form.append('description', formData.description || '');
            form.append('parent', formData.parent || '');
            form.append('order', formData.order);
            form.append('isActive', formData.isActive);
            
            if (imageFile) {
                form.append('image', imageFile);
            }

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            };

            if (editingCategory) {
                await axios.put(`${URLDevelopment}/api/category/${editingCategory._id}`, form, config);
                toast.success('Categoría actualizada correctamente');
            } else {
                await axios.post(`${URLDevelopment}/api/category`, form, config);
                toast.success('Categoría creada correctamente');
            }
            
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            toast.error(error.response?.data?.error || 'Error al guardar la categoría');
        }
    };

    const handleDelete = async (categoryId, categoryName) => {
        // Verificar si tiene subcategorías
        const hasSubcategories = categories.some(cat => cat.parent?._id === categoryId);
        
        if (hasSubcategories) {
            toast.error('No puedes eliminar una categoría con subcategorías. Elimina primero las subcategorías.');
            return;
        }

        setDeleteModal({ isOpen: true, categoryId, categoryName });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${URLDevelopment}/api/category/${deleteModal.categoryId}`);
            toast.success('Categoría eliminada correctamente');
            fetchCategories();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            toast.error('Error al eliminar la categoría');
        }
    };

    const getParentCategories = () => {
        return categories.filter(cat => !cat.parent);
    };

    const getSubcategories = (parentId) => {
        return categories.filter(cat => cat.parent?._id === parentId);
    };

    const toggleCategoryExpansion = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const getCategoryHierarchy = (category) => {
        if (!category.parent) return category.name;
        const parent = categories.find(cat => cat._id === category.parent._id);
        return parent ? `${parent.name} > ${category.name}` : category.name;
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
                        <p className='text-gray-600 mt-4 text-lg'>Cargando categorías...</p>
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
                    { label: 'Categorías' }
                ]} />

                <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-3xl font-bold text-secondary'>Gestión de Categorías</h1>
                        <button
                            onClick={() => handleOpenModal()}
                            className='bg-primary hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <span className='material-symbols-outlined'>add</span>
                            Nueva Categoría
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className='mb-6 flex gap-4'>
                                            {/* Búsqueda */}
                            <div className='relative flex-1'>
                                <input
                                    type='text'
                                    placeholder='Buscar categorías...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            {/* Filtro por tipo */}
                            <div>
                                <select
                                    value={filterParent}
                                    onChange={(e) => setFilterParent(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                    <option value='root'>Solo categorías principales</option>
                                    <option value='all'>Todas las categorías</option>
                                    <option value='sub'>Solo subcategorías</option>
                                </select>
                            </div>
                        </div>

                    {/* Tabla de Categorías */}
                    <div className='overflow-x-auto'>
                        <table className='min-w-full'>
                            <thead className='bg-secondary text-white'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Categoría</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Jerarquía</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Descripción</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Orden</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Estado</th>
                                    <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {filteredCategories.map((category) => {
                                    const subcategories = getSubcategories(category._id);
                                    const isExpanded = expandedCategories[category._id];
                                    const hasSubcategories = subcategories.length > 0;
                                    
                                    return (
                                        <React.Fragment key={category._id}>
                                            {/* Fila de Categoría Padre */}
                                            <tr className='hover:bg-gray-50'>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center gap-3'>
                                                        {/* Botón expandir si tiene subcategorías */}
                                                        {hasSubcategories && (
                                                            <button
                                                                onClick={() => toggleCategoryExpansion(category._id)}
                                                                className='p-1 hover:bg-gray-200 rounded transition-colors'
                                                            >
                                                                <span className='material-symbols-outlined text-gray-600'>
                                                                    {isExpanded ? 'expand_more' : 'chevron_right'}
                                                                </span>
                                                            </button>
                                                        )}
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.parent ? 'bg-blue-500' : 'bg-primary'}`}>
                                                            <span className='material-symbols-outlined text-white' style={{fontSize: '24px'}}>
                                                                {category.parent ? 'subdirectory_arrow_right' : 'category'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className='font-semibold text-secondary text-base'>{category.name}</p>
                                                            <p className='text-sm text-gray-500'>{category.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div>
                                                        <p className='text-gray-700 text-base'>{getCategoryHierarchy(category)}</p>
                                                        {hasSubcategories && (
                                                            <span className='inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800'>
                                                                <span className='material-symbols-outlined' style={{fontSize: '14px'}}>folder</span>
                                                                {subcategories.length} subcategoría{subcategories.length !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 text-gray-600'>
                                                    {category.description ? (category.description.length > 60 ? category.description.substring(0, 60) + '...' : category.description) : '-'}
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span className='px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700'>
                                                        {category.order}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {category.isActive ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <button
                                                            onClick={() => handleOpenModal(category)}
                                                            className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                                                            title='Editar'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                                                edit
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category._id, category.name)}
                                                            className='p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
                                                            title='Eliminar'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                                                delete
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {/* Filas de Subcategorías (expandibles) */}
                                            {hasSubcategories && isExpanded && subcategories.map((subcat) => (
                                                <tr key={subcat._id} className='bg-blue-50 hover:bg-blue-100'>
                                                    <td className='px-6 py-4 pl-20'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500'>
                                                                <span className='material-symbols-outlined text-white' style={{fontSize: '20px'}}>
                                                                    subdirectory_arrow_right
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className='font-semibold text-secondary text-sm'>{subcat.name}</p>
                                                                <p className='text-xs text-gray-500'>{subcat.slug}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4 text-sm text-gray-600'>
                                                        {category.name} &gt; {subcat.name}
                                                    </td>
                                                    <td className='px-6 py-4 text-sm text-gray-600'>
                                                        {subcat.description ? (subcat.description.length > 40 ? subcat.description.substring(0, 40) + '...' : subcat.description) : '-'}
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <span className='px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700'>
                                                            {subcat.order}
                                                        </span>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${subcat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {subcat.isActive ? 'Activa' : 'Inactiva'}
                                                        </span>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center justify-center gap-2'>
                                                            <button
                                                                onClick={() => handleOpenModal(subcat)}
                                                                className='p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                                                                title='Editar'
                                                            >
                                                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                                    edit
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(subcat._id, subcat.name)}
                                                                className='p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
                                                                title='Eliminar'
                                                            >
                                                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                                    delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='p-6 border-b border-gray-200'>
                            <h2 className='text-2xl font-bold text-secondary'>
                                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                            {/* Nombre */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Nombre *
                                </label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                    placeholder='Electrodomésticos'
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
                                    className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                    placeholder='Descripción de la categoría...'
                                />
                            </div>

                            {/* Categoría Padre */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Categoría Padre (para crear subcategoría)
                                </label>
                                <select
                                    name='parent'
                                    value={formData.parent}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                >
                                    <option value=''>Sin categoría padre (categoría principal)</option>
                                    {getParentCategories()
                                        .filter(cat => !editingCategory || cat._id !== editingCategory._id)
                                        .map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Imagen de la categoría */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Imagen de la categoría
                                </label>
                                {imagePreview ? (
                                    <div className='relative'>
                                        <img 
                                            src={imagePreview} 
                                            alt='Preview' 
                                            className='w-full h-48 object-cover rounded-lg'
                                        />
                                        <button
                                            type='button'
                                            onClick={handleRemoveImage}
                                            className='absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors'
                                        >
                                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors'>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            onChange={handleImageChange}
                                            className='hidden'
                                            id='category-image'
                                        />
                                        <label htmlFor='category-image' className='cursor-pointer'>
                                            <span className='material-symbols-outlined text-gray-400' style={{fontSize: '48px'}}>
                                                add_photo_alternate
                                            </span>
                                            <p className='mt-2 text-sm text-gray-600'>Haz clic para subir una imagen</p>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Orden y Estado */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Orden
                                    </label>
                                    <input
                                        type='number'
                                        name='order'
                                        value={formData.order}
                                        onChange={handleChange}
                                        min='0'
                                        className='w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                                    />
                                </div>

                                <div className='flex items-end'>
                                    <label className='flex items-center gap-2 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            name='isActive'
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
                                        />
                                        <span className='text-sm font-medium text-gray-700'>Categoría activa</span>
                                    </label>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
                                <button
                                    type='button'
                                    onClick={handleCloseModal}
                                    className='px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    Cancelar
                                </button>
                                <button
                                    type='submit'
                                    className='px-6 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
                                >
                                    {editingCategory ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' })}
                onConfirm={confirmDelete}
                title='¿Eliminar categoría?'
                message={`¿Estás seguro de que deseas eliminar "${deleteModal.categoryName}"? Esta acción no se puede deshacer.`}
                confirmText='Sí, eliminar'
                cancelText='Cancelar'
            />
        </div>
    );
};

export default AdminCategories;

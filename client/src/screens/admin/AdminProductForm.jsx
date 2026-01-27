import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import Tabs from '../../components/admin/Tabs';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        // Básico
        name: '',
        description: '',
        price: '',
        category: '',
        sku: '',
        brand: '',
        model: '',
        
        // Stock
        quantity: 0,
        minStock: 5,
        maxStock: '',
        availability: 'en-stock',
        warehouseLocation: '',
        supplier: '',
        restockDays: '',
        
        // Descuento
        discountActive: false,
        discountPercentage: '',
        discountStartDate: '',
        discountStartTime: '00:00',
        discountEndDate: '',
        discountEndTime: '23:59',
        costPrice: '',
        
        // Especificaciones
        specifications: [],
        highlights: [],
        packageContents: [],
        tags: [],
        
        // Variantes
        colors: [],
        sizes: [],
        material: '',
        
        // Dimensiones
        weight: '',
        dimensionsHeight: '',
        dimensionsWidth: '',
        dimensionsDepth: '',
        
        // Envío
        shipping: false,
        freeShipping: false,
        deliveryTime: '',
        isFragile: false,
        requiresInstallation: false,
        
        // Características
        energyClass: '',
        warranty: '',
        connectivity: [],
        operatingSystem: '',
        powerConsumption: '',
        
        // Otros
        featured: false,
        badge: '',
        manualPdfUrl: '',
        usageType: '',
        secondaryCategory: '',
        
        // SEO
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        slug: '',
        
        isActive: true
    });

    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados temporales para arrays
    const [newSpec, setNewSpec] = useState({ key: '', value: '', unit: '' });
    const [newHighlight, setNewHighlight] = useState('');
    const [newPackageItem, setNewPackageItem] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
    const [newSize, setNewSize] = useState('');
    const [newConnectivity, setNewConnectivity] = useState('');
    const [newKeyword, setNewKeyword] = useState('');

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/category/all`);
            setCategories(res.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            toast.error('Error al cargar las categorías');
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/product/${id}`);
            const product = res.data;
            
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category?._id || '',
                sku: product.sku || '',
                brand: product.brand || '',
                model: product.model || '',
                
                quantity: product.quantity || 0,
                minStock: product.minStock || 5,
                maxStock: product.maxStock || '',
                availability: product.availability || 'en-stock',
                warehouseLocation: product.warehouseLocation || '',
                supplier: product.supplier || '',
                restockDays: product.restockDays || '',
                
                discountActive: product.discount?.active || false,
                discountPercentage: product.discount?.percentage || '',
                discountStartDate: product.discount?.startDate ? product.discount.startDate.split('T')[0] : '',
                discountStartTime: product.discount?.startDate ? product.discount.startDate.split('T')[1]?.substring(0, 5) || '00:00' : '00:00',
                discountEndDate: product.discount?.endDate ? product.discount.endDate.split('T')[0] : '',
                discountEndTime: product.discount?.endDate ? product.discount.endDate.split('T')[1]?.substring(0, 5) || '23:59' : '23:59',
                costPrice: product.costPrice || '',
                
                specifications: product.specifications || [],
                highlights: product.highlights || [],
                packageContents: product.packageContents || [],
                tags: product.tags || [],
                
                colors: product.colors || [],
                sizes: product.sizes || [],
                material: product.material || '',
                
                weight: product.weight || '',
                dimensionsHeight: product.dimensions?.height || '',
                dimensionsWidth: product.dimensions?.width || '',
                dimensionsDepth: product.dimensions?.depth || '',
                
                shipping: product.shipping || false,
                freeShipping: product.freeShipping || false,
                deliveryTime: product.deliveryTime || '',
                isFragile: product.isFragile || false,
                requiresInstallation: product.requiresInstallation || false,
                
                energyClass: product.energyClass || '',
                warranty: product.warranty || '',
                connectivity: product.connectivity || [],
                operatingSystem: product.operatingSystem || '',
                powerConsumption: product.powerConsumption || '',
                
                featured: product.featured || false,
                badge: product.badge || '',
                manualPdfUrl: product.manualPdfUrl || '',
                usageType: product.usageType || '',
                secondaryCategory: product.secondaryCategory || '',
                
                metaTitle: product.seo?.metaTitle || '',
                metaDescription: product.seo?.metaDescription || '',
                keywords: product.seo?.keywords || [],
                slug: product.seo?.slug || '',
                
                isActive: product.isActive !== undefined ? product.isActive : true
            });
            
            if (product.images && product.images.length > 0) {
                setExistingImages(product.images);
            }
        } catch (error) {
            console.error('Error al cargar producto:', error);
            toast.error('Error al cargar el producto');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Funciones para manejar arrays
    const addSpecification = () => {
        if (newSpec.key && newSpec.value) {
            setFormData({
                ...formData,
                specifications: [...formData.specifications, newSpec]
            });
            setNewSpec({ key: '', value: '', unit: '' });
        }
    };

    const removeSpecification = (index) => {
        setFormData({
            ...formData,
            specifications: formData.specifications.filter((_, i) => i !== index)
        });
    };

    const addHighlight = () => {
        if (newHighlight.trim()) {
            setFormData({
                ...formData,
                highlights: [...formData.highlights, newHighlight.trim()]
            });
            setNewHighlight('');
        }
    };

    const removeHighlight = (index) => {
        setFormData({
            ...formData,
            highlights: formData.highlights.filter((_, i) => i !== index)
        });
    };

    const addPackageItem = () => {
        if (newPackageItem.trim()) {
            setFormData({
                ...formData,
                packageContents: [...formData.packageContents, newPackageItem.trim()]
            });
            setNewPackageItem('');
        }
    };

    const removePackageItem = (index) => {
        setFormData({
            ...formData,
            packageContents: formData.packageContents.filter((_, i) => i !== index)
        });
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            });
            setNewTag('');
        }
    };

    const removeTag = (index) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index)
        });
    };

    const addColor = () => {
        if (newColor.name.trim()) {
            setFormData({
                ...formData,
                colors: [...formData.colors, { ...newColor, available: true }]
            });
            setNewColor({ name: '', hex: '#000000' });
        }
    };

    const removeColor = (index) => {
        setFormData({
            ...formData,
            colors: formData.colors.filter((_, i) => i !== index)
        });
    };

    const addSize = () => {
        if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
            setFormData({
                ...formData,
                sizes: [...formData.sizes, newSize.trim()]
            });
            setNewSize('');
        }
    };

    const removeSize = (index) => {
        setFormData({
            ...formData,
            sizes: formData.sizes.filter((_, i) => i !== index)
        });
    };

    const addConnectivity = () => {
        if (newConnectivity.trim() && !formData.connectivity.includes(newConnectivity.trim())) {
            setFormData({
                ...formData,
                connectivity: [...formData.connectivity, newConnectivity.trim()]
            });
            setNewConnectivity('');
        }
    };

    const removeConnectivity = (index) => {
        setFormData({
            ...formData,
            connectivity: formData.connectivity.filter((_, i) => i !== index)
        });
    };

    const addKeyword = () => {
        if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, newKeyword.trim()]
            });
            setNewKeyword('');
        }
    };

    const removeKeyword = (index) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index)
        });
    };

    // Manejo de imágenes
    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setNewImages([...newImages, ...files]);
            
            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                isNew: true,
                file
            }));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    const handleRemoveExistingImage = (publicId) => {
        setImagesToRemove([...imagesToRemove, publicId]);
        setExistingImages(existingImages.filter(img => img.public_id !== publicId));
    };

    const handleRemoveNewImage = (index) => {
        const newImagesArray = [...newImages];
        const newPreviewsArray = imagePreviews.filter(p => p.isNew);
        
        newImagesArray.splice(index, 1);
        newPreviewsArray.splice(index, 1);
        
        setNewImages(newImagesArray);
        setImagePreviews([
            ...existingImages.map(img => ({ ...img, isNew: false })),
            ...newPreviewsArray
        ]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            
            // Campos básicos
            form.append('name', formData.name);
            form.append('description', formData.description);
            form.append('price', formData.price);
            form.append('category', formData.category);
            
            // Campos opcionales
            if (formData.sku) form.append('sku', formData.sku);
            if (formData.brand) form.append('brand', formData.brand);
            if (formData.model) form.append('model', formData.model);
            
            // Stock
            form.append('quantity', formData.quantity);
            form.append('minStock', formData.minStock);
            if (formData.maxStock) form.append('maxStock', formData.maxStock);
            form.append('availability', formData.availability);
            if (formData.warehouseLocation) form.append('warehouseLocation', formData.warehouseLocation);
            if (formData.supplier) form.append('supplier', formData.supplier);
            if (formData.restockDays) form.append('restockDays', formData.restockDays);
            
            // Descuento
            form.append('discount', JSON.stringify({
                active: formData.discountActive,
                percentage: Number(formData.discountPercentage) || 0,
                originalPrice: Number(formData.price),
                startDate: formData.discountStartDate ? `${formData.discountStartDate}T${formData.discountStartTime || '00:00'}:00.000Z` : null,
                endDate: formData.discountEndDate ? `${formData.discountEndDate}T${formData.discountEndTime || '23:59'}:59.999Z` : null
            }));
            if (formData.costPrice) form.append('costPrice', formData.costPrice);
            
            // Arrays
            form.append('specifications', JSON.stringify(formData.specifications));
            form.append('highlights', JSON.stringify(formData.highlights));
            form.append('packageContents', JSON.stringify(formData.packageContents));
            form.append('tags', JSON.stringify(formData.tags));
            form.append('colors', JSON.stringify(formData.colors));
            form.append('sizes', JSON.stringify(formData.sizes));
            form.append('connectivity', JSON.stringify(formData.connectivity));
            
            // LOG PARA DEBUG
            console.log('=== DATOS ENVIADOS ===');
            console.log('specifications:', formData.specifications);
            console.log('colors:', formData.colors);
            console.log('highlights:', formData.highlights);
            console.log('tags:', formData.tags);
            
            // Dimensiones
            if (formData.weight) form.append('weight', formData.weight);
            if (formData.dimensionsHeight || formData.dimensionsWidth || formData.dimensionsDepth) {
                form.append('dimensions', JSON.stringify({
                    height: Number(formData.dimensionsHeight) || 0,
                    width: Number(formData.dimensionsWidth) || 0,
                    depth: Number(formData.dimensionsDepth) || 0
                }));
            }
            
            // Otros campos
            if (formData.material) form.append('material', formData.material);
            form.append('shipping', formData.shipping);
            form.append('freeShipping', formData.freeShipping);
            if (formData.deliveryTime) form.append('deliveryTime', formData.deliveryTime);
            form.append('isFragile', formData.isFragile);
            form.append('requiresInstallation', formData.requiresInstallation);
            
            if (formData.energyClass) form.append('energyClass', formData.energyClass);
            if (formData.warranty) form.append('warranty', formData.warranty);
            if (formData.operatingSystem) form.append('operatingSystem', formData.operatingSystem);
            if (formData.powerConsumption) form.append('powerConsumption', formData.powerConsumption);
            
            form.append('featured', formData.featured);
            if (formData.badge) form.append('badge', formData.badge);
            if (formData.manualPdfUrl) form.append('manualPdfUrl', formData.manualPdfUrl);
            if (formData.usageType) form.append('usageType', formData.usageType);
            if (formData.secondaryCategory) form.append('secondaryCategory', formData.secondaryCategory);
            
            // SEO
            form.append('seo', JSON.stringify({
                metaTitle: formData.metaTitle || formData.name,
                metaDescription: formData.metaDescription || formData.description.substring(0, 160),
                keywords: formData.keywords,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
            }));
            
            form.append('isActive', formData.isActive);
            
            // Imágenes
            newImages.forEach(image => {
                form.append('images', image);
            });

            if (isEditMode && imagesToRemove.length > 0) {
                form.append('removeImages', JSON.stringify(imagesToRemove));
            }

            if (isEditMode) {
                await axios.put(`${URLDevelopment}/api/product/${id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto actualizado correctamente');
            } else {
                await axios.post(`${URLDevelopment}/api/product`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto creado correctamente');
            }

            navigate('/dashboard/admin/products');
        } catch (error) {
            console.error('Error al guardar producto:', error);
            toast.error(error.response?.data?.error || 'Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex min-h-screen bg-background'>
            <AdminSidebar />
            
            <main className='flex-1 p-8'>
                <Breadcrumbs items={[
                    { label: 'Dashboard', href: '/dashboard/admin' },
                    { label: 'Productos', href: '/dashboard/admin/products' },
                    { label: isEditMode ? 'Editar Producto' : 'Nuevo Producto' }
                ]} />
                
                <div className='max-w-7xl mx-auto'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='text-3xl font-bold text-secondary mb-2'>
                            {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
                        </h1>
                        <p className='text-gray-600'>
                            {isEditMode ? 'Actualiza la información del producto' : 'Completa el formulario para crear un producto'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow-lg p-8'>
                        <Tabs tabs={[
                            { label: 'Información Básica', icon: 'info' },
                            { label: 'Precios y Stock', icon: 'euro' },
                            { label: 'Especificaciones', icon: 'list' },
                            { label: 'Imágenes y Archivos', icon: 'image' },
                            { label: 'Envío y Logística', icon: 'local_shipping' },
                            { label: 'SEO y Categorización', icon: 'search' }
                        ]}>
{/* TAB 1: INFORMACIÓN BÁSICA */}
<div className='space-y-6'>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Nombre */}
        <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nombre del Producto *
            </label>
            <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='Ej: Frigorífico LG GBB92STAXP'
            />
        </div>

        {/* Descripción */}
        <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Descripción * <span className='text-xs text-gray-500'>(soporta HTML)</span>
            </label>
            <RichTextEditor
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder='Describe las características del producto...'
                rows={8}
            />
        </div>

        {/* SKU */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                SKU (Código único)
            </label>
            <input
                type='text'
                name='sku'
                value={formData.sku}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='PROD-001'
            />
        </div>

        {/* Marca */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Marca
            </label>
            <input
                type='text'
                name='brand'
                value={formData.brand}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='LG, Samsung, Sony...'
            />
        </div>

        {/* Modelo */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Modelo
            </label>
            <input
                type='text'
                name='model'
                value={formData.model}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='GBB92STAXP'
            />
        </div>

        {/* Categoría */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Categoría *
            </label>
            <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
                <option value=''>Seleccionar categoría</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
        </div>

        {/* Badge */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Badge / Etiqueta
            </label>
            <select
                name='badge'
                value={formData.badge}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
                <option value=''>Sin badge</option>
                <option value='nuevo'>NUEVO</option>
                <option value='oferta'>OFERTA</option>
                <option value='mas-vendido'>MÁS VENDIDO</option>
                <option value='destacado'>DESTACADO</option>
                <option value='envio-gratis'>ENVÍO GRATIS</option>
            </select>
        </div>

        {/* Destacado */}
        <div className='md:col-span-2 flex items-center gap-2'>
            <input
                type='checkbox'
                id='featured'
                name='featured'
                checked={formData.featured}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='featured' className='text-sm font-medium text-gray-700'>
                Mostrar como producto destacado en la página principal
            </label>
        </div>

        {/* Activo */}
        <div className='md:col-span-2 flex items-center gap-2'>
            <input
                type='checkbox'
                id='isActive'
                name='isActive'
                checked={formData.isActive}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='isActive' className='text-sm font-medium text-gray-700'>
                Producto activo (visible en la tienda)
            </label>
        </div>
    </div>
</div>

{/* TAB 2: PRECIOS Y STOCK */}
<div className='space-y-6'>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Precio */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Precio (€) *
            </label>
            <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                required
                min='0'
                step='0.01'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='0.00'
            />
        </div>

        {/* Precio de coste */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Precio de Coste (€)
            </label>
            <input
                type='number'
                name='costPrice'
                value={formData.costPrice}
                onChange={handleChange}
                min='0'
                step='0.01'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='0.00'
            />
            <p className='text-xs text-gray-500 mt-1'>Solo visible para administradores</p>
        </div>
    </div>

    {/* Descuento */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-bold text-secondary flex items-center gap-2'>
                <span className='material-symbols-outlined text-red-600'>sell</span>
                Descuento / Oferta
            </h3>
            {formData.discountActive && formData.discountPercentage && (
                <div className='bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg'>
                    -{formData.discountPercentage}% OFF
                </div>
            )}
        </div>
        
        <div className='flex items-center gap-2 mb-4'>
            <input
                type='checkbox'
                id='discountActive'
                name='discountActive'
                checked={formData.discountActive}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='discountActive' className='text-sm font-medium text-gray-700'>
                Activar descuento en este producto
            </label>
        </div>

        {formData.discountActive && (
            <>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Porcentaje (%) *
                        </label>
                        <input
                            type='number'
                            name='discountPercentage'
                            value={formData.discountPercentage}
                            onChange={handleChange}
                            min='0'
                            max='100'
                            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            placeholder='10'
                            required={formData.discountActive}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Fecha y Hora de Inicio (opcional)
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='date'
                                name='discountStartDate'
                                value={formData.discountStartDate}
                                onChange={handleChange}
                                className='flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            />
                            <input
                                type='time'
                                name='discountStartTime'
                                value={formData.discountStartTime}
                                onChange={handleChange}
                                className='w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Fecha y Hora de Fin (opcional)
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type='date'
                                name='discountEndDate'
                                value={formData.discountEndDate}
                                onChange={handleChange}
                                className='flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            />
                            <input
                                type='time'
                                name='discountEndTime'
                                value={formData.discountEndTime}
                                onChange={handleChange}
                                className='w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            />
                        </div>
                    </div>
                </div>

                {/* Vista previa del descuento */}
                {formData.price && formData.discountPercentage && (
                    <div className='bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4'>
                        <h4 className='font-bold text-green-900 mb-3 flex items-center gap-2'>
                            <span className='material-symbols-outlined'>visibility</span>
                            Vista previa del precio
                        </h4>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
                            <div>
                                <p className='text-sm text-gray-600 mb-1'>Precio original</p>
                                <p className='text-2xl font-bold text-gray-400 line-through'>
                                    {Number(formData.price).toFixed(2)}€
                                </p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600 mb-1'>Descuento aplicado</p>
                                <p className='text-2xl font-bold text-red-600'>
                                    -{formData.discountPercentage}%
                                </p>
                                <p className='text-sm text-green-700 font-medium'>
                                    Ahorras {(formData.price * formData.discountPercentage / 100).toFixed(2)}€
                                </p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600 mb-1'>Precio final</p>
                                <p className='text-3xl font-bold text-green-600'>
                                    {(formData.price - (formData.price * formData.discountPercentage / 100)).toFixed(2)}€
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3'>
                    <p className='text-sm text-blue-900 flex items-start gap-2'>
                        <span className='material-symbols-outlined' style={{fontSize: '18px'}}>info</span>
                        <span>
                            <strong>Importante:</strong> El descuento se mostrará automáticamente en las tarjetas de producto y en la página de detalle. 
                            Si configuras fechas, el descuento solo estará activo en ese período.
                        </span>
                    </p>
                </div>
            </>
        )}
    </div>

    {/* Stock */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Inventario</h3>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Stock Actual *
                </label>
                <input
                    type='number'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min='0'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Stock Mínimo
                </label>
                <input
                    type='number'
                    name='minStock'
                    value={formData.minStock}
                    onChange={handleChange}
                    min='0'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                />
                <p className='text-xs text-gray-500 mt-1'>Alerta cuando esté por debajo</p>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Stock Máximo
                </label>
                <input
                    type='number'
                    name='maxStock'
                    value={formData.maxStock}
                    onChange={handleChange}
                    min='0'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Disponibilidad
                </label>
                <select
                    name='availability'
                    value={formData.availability}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                >
                    <option value='en-stock'>En Stock</option>
                    <option value='bajo-pedido'>Bajo Pedido</option>
                    <option value='agotado'>Agotado</option>
                    <option value='descontinuado'>Descontinuado</option>
                </select>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Ubicación en Almacén
                </label>
                <input
                    type='text'
                    name='warehouseLocation'
                    value={formData.warehouseLocation}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='A-12-03'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Días de Reposición
                </label>
                <input
                    type='number'
                    name='restockDays'
                    value={formData.restockDays}
                    onChange={handleChange}
                    min='0'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='7'
                />
            </div>

            <div className='md:col-span-3'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Proveedor
                </label>
                <input
                    type='text'
                    name='supplier'
                    value={formData.supplier}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='Nombre del proveedor'
                />
            </div>
        </div>
    </div>
</div>

{/* TAB 3: ESPECIFICACIONES */}
<div className='space-y-6'>
    {/* Especificaciones Técnicas */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Especificaciones Técnicas</h3>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
            <input
                type='text'
                placeholder='Clave (ej: Potencia)'
                value={newSpec.key}
                onChange={(e) => setNewSpec({...newSpec, key: e.target.value})}
                className='px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <input
                type='text'
                placeholder='Valor (ej: 1000)'
                value={newSpec.value}
                onChange={(e) => setNewSpec({...newSpec, value: e.target.value})}
                className='px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <div className='flex gap-2'>
                <input
                    type='text'
                    placeholder='Unidad (ej: W)'
                    value={newSpec.unit}
                    onChange={(e) => setNewSpec({...newSpec, unit: e.target.value})}
                    className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                />
                <button
                    type='button'
                    onClick={addSpecification}
                    className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
                >
                    <span className='material-symbols-outlined'>add</span>
                </button>
            </div>
        </div>

        {formData.specifications.length > 0 && (
            <div className='space-y-2'>
                {formData.specifications.map((spec, index) => (
                    <div key={index} className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                        <span className='text-sm'>
                            <strong>{spec.key}:</strong> {spec.value} {spec.unit}
                        </span>
                        <button
                            type='button'
                            onClick={() => removeSpecification(index)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <span className='material-symbols-outlined text-sm'>close</span>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>

    {/* Características Destacadas */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Características Destacadas</h3>
        
        <div className='flex gap-2 mb-3'>
            <input
                type='text'
                placeholder='Ej: Bajo consumo energético'
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <button
                type='button'
                onClick={addHighlight}
                className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
            >
                <span className='material-symbols-outlined'>add</span>
            </button>
        </div>

        {formData.highlights.length > 0 && (
            <ul className='space-y-2'>
                {formData.highlights.map((highlight, index) => (
                    <li key={index} className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                        <span className='text-sm flex items-center gap-2'>
                            <span className='material-symbols-outlined text-primary text-sm'>check_circle</span>
                            {highlight}
                        </span>
                        <button
                            type='button'
                            onClick={() => removeHighlight(index)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <span className='material-symbols-outlined text-sm'>close</span>
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>

    {/* Contenido del Paquete */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Contenido del Paquete</h3>
        
        <div className='flex gap-2 mb-3'>
            <input
                type='text'
                placeholder='Ej: 1x Cable de alimentación'
                value={newPackageItem}
                onChange={(e) => setNewPackageItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPackageItem())}
                className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <button
                type='button'
                onClick={addPackageItem}
                className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
            >
                <span className='material-symbols-outlined'>add</span>
            </button>
        </div>

        {formData.packageContents.length > 0 && (
            <ul className='space-y-2'>
                {formData.packageContents.map((item, index) => (
                    <li key={index} className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                        <span className='text-sm'>{item}</span>
                        <button
                            type='button'
                            onClick={() => removePackageItem(index)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <span className='material-symbols-outlined text-sm'>close</span>
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>

    {/* Variantes: Colores */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Colores Disponibles</h3>
        
        <div className='flex gap-2 mb-3'>
            <input
                type='text'
                placeholder='Nombre del color'
                value={newColor.name}
                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <input
                type='color'
                value={newColor.hex}
                onChange={(e) => setNewColor({...newColor, hex: e.target.value})}
                className='w-16 h-11 border-2 border-gray-300 rounded-lg cursor-pointer'
            />
            <button
                type='button'
                onClick={addColor}
                className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
            >
                <span className='material-symbols-outlined'>add</span>
            </button>
        </div>

        {formData.colors.length > 0 && (
            <div className='flex flex-wrap gap-2'>
                {formData.colors.map((color, index) => (
                    <div key={index} className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                        <div 
                            className='w-6 h-6 rounded-full border-2 border-gray-300'
                            style={{backgroundColor: color.hex}}
                        />
                        <span className='text-sm'>{color.name}</span>
                        <button
                            type='button'
                            onClick={() => removeColor(index)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <span className='material-symbols-outlined text-sm'>close</span>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>

    {/* Variantes: Tallas/Capacidades */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Tallas / Capacidades</h3>
        <p className='text-sm text-gray-600 mb-3'>Ej: 64GB, 128GB, 256GB o S, M, L, XL</p>
        
        <div className='flex gap-2 mb-3'>
            <input
                type='text'
                placeholder='Ej: 128GB'
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <button
                type='button'
                onClick={addSize}
                className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
            >
                <span className='material-symbols-outlined'>add</span>
            </button>
        </div>

        {formData.sizes.length > 0 && (
            <div className='flex flex-wrap gap-2'>
                {formData.sizes.map((size, index) => (
                    <div key={index} className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                        <span className='text-sm font-medium'>{size}</span>
                        <button
                            type='button'
                            onClick={() => removeSize(index)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <span className='material-symbols-outlined text-sm'>close</span>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>

    {/* Campos técnicos específicos */}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Material
            </label>
            <input
                type='text'
                name='material'
                value={formData.material}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='Plástico, Metal, Vidrio...'
            />
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Clase Energética
            </label>
            <select
                name='energyClass'
                value={formData.energyClass}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
                <option value=''>Seleccionar</option>
                <option value='A+++'>A+++</option>
                <option value='A++'>A++</option>
                <option value='A+'>A+</option>
                <option value='A'>A</option>
                <option value='B'>B</option>
                <option value='C'>C</option>
                <option value='D'>D</option>
                <option value='E'>E</option>
                <option value='F'>F</option>
                <option value='G'>G</option>
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Garantía
            </label>
            <input
                type='text'
                name='warranty'
                value={formData.warranty}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='2 años, 3 años...'
            />
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Sistema Operativo
            </label>
            <input
                type='text'
                name='operatingSystem'
                value={formData.operatingSystem}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='Android, iOS, Windows...'
            />
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Consumo Energético
            </label>
            <input
                type='text'
                name='powerConsumption'
                value={formData.powerConsumption}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='150W, 65W...'
            />
        </div>
    </div>

    {/* Dimensiones y Peso */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Dimensiones y Peso</h3>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Alto (cm)
                </label>
                <input
                    type='number'
                    name='dimensionsHeight'
                    value={formData.dimensionsHeight}
                    onChange={handleChange}
                    min='0'
                    step='0.1'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='0'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Ancho (cm)
                </label>
                <input
                    type='number'
                    name='dimensionsWidth'
                    value={formData.dimensionsWidth}
                    onChange={handleChange}
                    min='0'
                    step='0.1'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='0'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Profundidad (cm)
                </label>
                <input
                    type='number'
                    name='dimensionsDepth'
                    value={formData.dimensionsDepth}
                    onChange={handleChange}
                    min='0'
                    step='0.1'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='0'
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Peso (kg)
                </label>
                <input
                    type='number'
                    name='weight'
                    value={formData.weight}
                    onChange={handleChange}
                    min='0'
                    step='0.1'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                    placeholder='0'
                />
            </div>
        </div>
    </div>

    {/* Conectividad */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Conectividad</h3>
        
        <div className='flex gap-2 mb-3'>
            <input
                type='text'
                placeholder='Ej: WiFi, Bluetooth, USB-C...'
                value={newConnectivity}
                onChange={(e) => setNewConnectivity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConnectivity())}
                className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <button
                type='button'
                onClick={addConnectivity}
                className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
            >
                <span className='material-symbols-outlined'>add</span>
            </button>
        </div>

        {formData.connectivity.length > 0 && (
            <div className='flex flex-wrap gap-2'>
                {formData.connectivity.map((conn, index) => (
                    <div key={index} className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                        <span className='text-sm'>{conn}</span>
                        <button
                            type='button'
                            onClick={() => removeConnectivity(index)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <span className='material-symbols-outlined text-sm'>close</span>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
</div>

{/* TAB 4: IMÁGENES Y ARCHIVOS */}
<div className='space-y-6'>
    {/* Imágenes del Producto */}
    <div className='border-2 border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-bold text-secondary mb-4'>Imágenes del Producto</h3>
        
        {/* Imágenes existentes */}
        {existingImages.length > 0 && (
            <div className='mb-4'>
                <p className='text-sm text-gray-600 mb-2'>Imágenes actuales:</p>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {existingImages.map((image) => (
                        <div key={image.public_id} className='relative group'>
                            <img
                                src={image.url}
                                alt='Producto'
                                className='w-full h-32 object-cover rounded-lg border-2 border-gray-300'
                            />
                            <button
                                type='button'
                                onClick={() => handleRemoveExistingImage(image.public_id)}
                                className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                                <span className='material-symbols-outlined text-sm'>close</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Nuevas imágenes */}
        {imagePreviews.filter(p => p.isNew).length > 0 && (
            <div className='mb-4'>
                <p className='text-sm text-gray-600 mb-2'>Nuevas imágenes a subir:</p>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {imagePreviews.filter(p => p.isNew).map((preview, index) => (
                        <div key={index} className='relative group'>
                            <img
                                src={preview.url}
                                alt={`Nueva ${index + 1}`}
                                className='w-full h-32 object-cover rounded-lg border-2 border-green-300'
                            />
                            <button
                                type='button'
                                onClick={() => handleRemoveNewImage(index)}
                                className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                                <span className='material-symbols-outlined text-sm'>close</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Input para agregar imágenes */}
        <div>
            <input
                type='file'
                accept='image/*'
                multiple
                onChange={handlePhotoChange}
                required={!isEditMode && existingImages.length === 0 && newImages.length === 0}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            />
            <p className='text-sm text-gray-500 mt-2'>
                Puedes seleccionar múltiples imágenes. Formatos: JPG, PNG, GIF, WEBP (máx. 5MB cada una)
            </p>
        </div>
    </div>

    {/* Video */}
    <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
            URL del Video (YouTube/Vimeo)
        </label>
        <input
            type='url'
            name='videoUrl'
            value={formData.videoUrl}
            onChange={handleChange}
            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            placeholder='https://www.youtube.com/watch?v=...'
        />
    </div>

    {/* Manual PDF */}
    <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
            URL del Manual (PDF)
        </label>
        <input
            type='url'
            name='manualPdfUrl'
            value={formData.manualPdfUrl}
            onChange={handleChange}
            className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            placeholder='https://ejemplo.com/manual.pdf'
        />
    </div>
</div>

{/* TAB 5: ENVÍO Y LOGÍSTICA */}
<div className='space-y-6'>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tiempo de Entrega
            </label>
            <input
                type='text'
                name='deliveryTime'
                value={formData.deliveryTime}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='24-48h, 3-5 días...'
            />
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tipo de Uso
            </label>
            <select
                name='usageType'
                value={formData.usageType}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
                <option value=''>Seleccionar</option>
                <option value='hogar'>Hogar</option>
                <option value='oficina'>Oficina</option>
                <option value='gaming'>Gaming</option>
                <option value='profesional'>Profesional</option>
                <option value='exterior'>Exterior</option>
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Subcategoría
            </label>
            <select
                name='secondaryCategory'
                value={formData.secondaryCategory}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
            >
                <option value=''>Sin subcategoría</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
            <p className='text-xs text-gray-500 mt-1'>Categoría adicional para mejor organización</p>
        </div>
    </div>

    {/* Checkboxes de envío */}
    <div className='space-y-3'>
        <div className='flex items-center gap-2'>
            <input
                type='checkbox'
                id='shipping'
                name='shipping'
                checked={formData.shipping}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='shipping' className='text-sm font-medium text-gray-700'>
                Se puede enviar
            </label>
        </div>

        <div className='flex items-center gap-2'>
            <input
                type='checkbox'
                id='freeShipping'
                name='freeShipping'
                checked={formData.freeShipping}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='freeShipping' className='text-sm font-medium text-gray-700'>
                Envío gratuito
            </label>
        </div>

        <div className='flex items-center gap-2'>
            <input
                type='checkbox'
                id='isFragile'
                name='isFragile'
                checked={formData.isFragile}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='isFragile' className='text-sm font-medium text-gray-700'>
                Producto frágil (requiere embalaje especial)
            </label>
        </div>

        <div className='flex items-center gap-2'>
            <input
                type='checkbox'
                id='requiresInstallation'
                name='requiresInstallation'
                checked={formData.requiresInstallation}
                onChange={handleChange}
                className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <label htmlFor='requiresInstallation' className='text-sm font-medium text-gray-700'>
                Requiere instalación
            </label>
        </div>
    </div>
</div>

{/* TAB 6: SEO Y CATEGORIZACIÓN */}
<div className='space-y-6'>
    <div className='grid grid-cols-1 gap-6'>
        {/* Meta Título */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Meta Título (SEO)
            </label>
            <input
                type='text'
                name='metaTitle'
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength='60'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='Si está vacío, se usará el nombre del producto'
            />
            <p className='text-xs text-gray-500 mt-1'>
                {formData.metaTitle.length}/60 caracteres
            </p>
        </div>

        {/* Meta Descripción */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Meta Descripción (SEO)
            </label>
            <textarea
                name='metaDescription'
                value={formData.metaDescription}
                onChange={handleChange}
                maxLength='160'
                rows='3'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='Si está vacío, se usará la descripción del producto'
            />
            <p className='text-xs text-gray-500 mt-1'>
                {formData.metaDescription.length}/160 caracteres
            </p>
        </div>

        {/* Slug */}
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Slug (URL amigable)
            </label>
            <input
                type='text'
                name='slug'
                value={formData.slug}
                onChange={handleChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                placeholder='producto-ejemplo-slug'
            />
            <p className='text-xs text-gray-500 mt-1'>
                Si está vacío, se generará automáticamente del nombre
            </p>
        </div>

        {/* Palabras Clave */}
        <div className='border-2 border-gray-200 rounded-lg p-6'>
            <h3 className='text-lg font-bold text-secondary mb-4'>Palabras Clave (SEO)</h3>
            
            <div className='flex gap-2 mb-3'>
                <input
                    type='text'
                    placeholder='Ej: frigorífico, electrodoméstico...'
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                />
                <button
                    type='button'
                    onClick={addKeyword}
                    className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
                >
                    <span className='material-symbols-outlined'>add</span>
                </button>
            </div>

            {formData.keywords.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                    {formData.keywords.map((keyword, index) => (
                        <div key={index} className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                            <span className='text-sm'>{keyword}</span>
                            <button
                                type='button'
                                onClick={() => removeKeyword(index)}
                                className='text-red-500 hover:text-red-700'
                            >
                                <span className='material-symbols-outlined text-sm'>close</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Tags */}
        <div className='border-2 border-gray-200 rounded-lg p-6'>
            <h3 className='text-lg font-bold text-secondary mb-4'>Tags / Etiquetas</h3>
            <p className='text-sm text-gray-600 mb-3'>Para búsqueda y filtros (ej: #smart #wifi #4k)</p>
            
            <div className='flex gap-2 mb-3'>
                <input
                    type='text'
                    placeholder='Ej: smart, wifi, 4k...'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                />
                <button
                    type='button'
                    onClick={addTag}
                    className='px-4 py-2 bg-primary hover:bg-yellow-600 text-white rounded-lg transition-colors'
                >
                    <span className='material-symbols-outlined'>add</span>
                </button>
            </div>

            {formData.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                    {formData.tags.map((tag, index) => (
                        <div key={index} className='flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg'>
                            <span className='text-sm text-blue-800 font-medium'>#{tag}</span>
                            <button
                                type='button'
                                onClick={() => removeTag(index)}
                                className='text-red-500 hover:text-red-700'
                            >
                                <span className='material-symbols-outlined text-sm'>close</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
</div>
                        </Tabs>

                        {/* Botones de acción */}
                        <div className='flex gap-4 mt-8 pt-6 border-t border-gray-200'>
                            <button
                                type='button'
                                onClick={() => navigate('/dashboard/admin/products')}
                                className='flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors'
                            >
                                Cancelar
                            </button>
                            <button
                                type='submit'
                                disabled={loading}
                                className='flex-1 px-6 py-3 bg-primary hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <span className='material-symbols-outlined animate-spin'>progress_activity</span>
                                        Guardando...
                                    </span>
                                ) : (
                                    isEditMode ? 'Actualizar Producto' : 'Crear Producto'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminProductForm;

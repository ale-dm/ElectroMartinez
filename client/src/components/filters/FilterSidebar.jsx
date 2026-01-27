import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';

const FilterSidebar = ({ onFilterChange, currentFilters }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [tags, setTags] = useState([]);
    const [colors, setColors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expanded, setExpanded] = useState({
        categories: true,
        brands: false,
        price: true,
        tags: false,
        colors: false,
        rating: false,
        condition: false,
        availability: false
    });

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchTags();
        fetchColors();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/category/all`);
            setCategories(res.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/product/list?limit=100`);
            const uniqueBrands = [...new Set(res.data
                .filter(p => p.brand)
                .map(p => p.brand)
            )].sort();
            setBrands(uniqueBrands);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/product/list?limit=100`);
            const allTags = res.data.reduce((acc, product) => {
                if (product.tags && product.tags.length > 0) {
                    return [...acc, ...product.tags];
                }
                return acc;
            }, []);
            const uniqueTags = [...new Set(allTags)].sort();
            setTags(uniqueTags);
        } catch (error) {
            console.error('Error al cargar tags:', error);
        }
    };

    const fetchColors = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/product/list?limit=100`);
            const allColors = res.data.reduce((acc, product) => {
                if (product.colors && product.colors.length > 0) {
                    return [...acc, ...product.colors];
                }
                return acc;
            }, []);
            // Eliminar duplicados por nombre
            const uniqueColors = allColors.filter((color, index, self) =>
                index === self.findIndex((c) => c.name === color.name)
            );
            setColors(uniqueColors);
        } catch (error) {
            console.error('Error al cargar colores:', error);
        }
    };

    const toggleSection = (section) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const getParentCategories = () => {
        return categories.filter(cat => !cat.parent).sort((a, b) => a.order - b.order);
    };

    const getSubcategories = (parentId) => {
        return categories.filter(cat => cat.parent?._id === parentId).sort((a, b) => a.order - b.order);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const newRange = { ...priceRange, [name]: Number(value) };
        setPriceRange(newRange);
        if (onFilterChange) {
            onFilterChange({ ...currentFilters, priceRange: newRange });
        }
    };

    const handleCategoryFilter = (categoryId) => {
        if (onFilterChange) {
            onFilterChange({ 
                ...currentFilters, 
                category: currentFilters.category === categoryId ? null : categoryId 
            });
        }
    };

    const handleBrandFilter = (brand) => {
        if (onFilterChange) {
            onFilterChange({ 
                ...currentFilters, 
                brand: currentFilters.brand === brand ? null : brand 
            });
        }
    };

    const handleTagFilter = (tag) => {
        if (onFilterChange) {
            const currentTags = currentFilters.tags || [];
            const newTags = currentTags.includes(tag)
                ? currentTags.filter(t => t !== tag)
                : [...currentTags, tag];
            onFilterChange({ ...currentFilters, tags: newTags });
        }
    };

    const handleColorFilter = (colorName) => {
        if (onFilterChange) {
            const currentColors = currentFilters.colors || [];
            const newColors = currentColors.includes(colorName)
                ? currentColors.filter(c => c !== colorName)
                : [...currentColors, colorName];
            onFilterChange({ ...currentFilters, colors: newColors });
        }
    };

    const handleRatingFilter = (rating) => {
        if (onFilterChange) {
            onFilterChange({ 
                ...currentFilters, 
                minRating: currentFilters.minRating === rating ? null : rating 
            });
        }
    };

    const handleConditionFilter = (condition) => {
        if (onFilterChange) {
            onFilterChange({ 
                ...currentFilters, 
                condition: currentFilters.condition === condition ? null : condition 
            });
        }
    };

    const handleAvailabilityFilter = (availability) => {
        if (onFilterChange) {
            onFilterChange({ 
                ...currentFilters, 
                availability: currentFilters.availability === availability ? null : availability 
            });
        }
    };

    const clearFilters = () => {
        setPriceRange({ min: 0, max: 10000 });
        if (onFilterChange) {
            onFilterChange({ 
                category: null, 
                brand: null, 
                tags: [], 
                colors: [], 
                minRating: null, 
                condition: null, 
                availability: null, 
                priceRange: { min: 0, max: 10000 } 
            });
        }
    };

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-secondary'>Filtros</h2>
                <button
                    onClick={clearFilters}
                    className='text-sm text-primary hover:text-yellow-600 font-medium'
                >
                    Limpiar
                </button>
            </div>

            {/* Categorías */}
            <div className='mb-6 border-b pb-4'>
                <button
                    onClick={() => toggleSection('categories')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Categorías</span>
                    <span className='material-symbols-outlined'>
                        {expanded.categories ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.categories && (
                    <div className='space-y-1'>
                        {getParentCategories().map((cat) => {
                            const subcategories = getSubcategories(cat._id);
                            const isExpanded = expandedCategories[cat._id];
                            const hasSubcategories = subcategories.length > 0;
                            
                            return (
                                <div key={cat._id}>
                                    {/* Categoría Padre */}
                                    <div className='flex items-center gap-1'>
                                        {hasSubcategories && (
                                            <button
                                                onClick={() => toggleCategory(cat._id)}
                                                className='p-1 hover:bg-gray-100 rounded transition-colors'
                                            >
                                                <span className='material-symbols-outlined text-sm'>
                                                    {isExpanded ? 'expand_more' : 'chevron_right'}
                                                </span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleCategoryFilter(cat._id)}
                                            className={`flex-1 text-left px-3 py-2 rounded transition-colors font-medium ${
                                                currentFilters.category === cat._id
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {cat.name}
                                            {hasSubcategories && (
                                                <span className='ml-1 text-xs opacity-75'>({subcategories.length})</span>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Subcategorías */}
                                    {hasSubcategories && isExpanded && (
                                        <div className='ml-6 mt-1 space-y-1'>
                                            {subcategories.map((subcat) => (
                                                <button
                                                    key={subcat._id}
                                                    onClick={() => handleCategoryFilter(subcat._id)}
                                                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                                                        currentFilters.category === subcat._id
                                                            ? 'bg-blue-500 text-white'
                                                            : 'hover:bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {subcat.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Marcas */}
            <div className='mb-6 border-b pb-4'>
                <button
                    onClick={() => toggleSection('brands')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Marcas</span>
                    <span className='material-symbols-outlined'>
                        {expanded.brands ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.brands && (
                    <div className='space-y-2 max-h-64 overflow-y-auto'>
                        {brands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => handleBrandFilter(brand)}
                                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                    currentFilters.brand === brand
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Rango de Precio */}
            <div className='mb-6 border-b pb-4'>
                <button
                    onClick={() => toggleSection('price')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Precio</span>
                    <span className='material-symbols-outlined'>
                        {expanded.price ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.price && (
                    <div className='space-y-3'>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>Mínimo (€)</label>
                            <input
                                type='number'
                                name='min'
                                value={priceRange.min}
                                onChange={handlePriceChange}
                                min='0'
                                className='w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none'
                            />
                        </div>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>Máximo (€)</label>
                            <input
                                type='number'
                                name='max'
                                value={priceRange.max}
                                onChange={handlePriceChange}
                                min='0'
                                className='w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none'
                            />
                        </div>
                        <div className='text-sm text-gray-600 text-center'>
                            {priceRange.min}€ - {priceRange.max}€
                        </div>
                    </div>
                )}
            </div>

            {/* Valoración */}
            <div className='mb-6 border-b pb-4'>
                <button
                    onClick={() => toggleSection('rating')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Valoración</span>
                    <span className='material-symbols-outlined'>
                        {expanded.rating ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.rating && (
                    <div className='space-y-2'>
                        {[4, 3, 2, 1].map(rating => (
                            <button
                                key={rating}
                                onClick={() => handleRatingFilter(rating)}
                                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-1 ${
                                    currentFilters.minRating === rating
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`material-symbols-outlined text-sm ${
                                        currentFilters.minRating === rating ? 'text-white' : 'text-primary'
                                    }`}>
                                        {i < rating ? 'star' : 'star_border'}
                                    </span>
                                ))}
                                <span className='ml-1'>y más</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Condición */}
            <div className='mb-6 border-b pb-4'>
                <button
                    onClick={() => toggleSection('condition')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Condición</span>
                    <span className='material-symbols-outlined'>
                        {expanded.condition ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.condition && (
                    <div className='space-y-2'>
                        {[
                            { value: 'nuevo', label: 'Nuevo' },
                            { value: 'reacondicionado', label: 'Reacondicionado' },
                            { value: 'exposicion', label: 'Exposición' },
                            { value: 'segunda-mano', label: 'Segunda Mano' }
                        ].map(cond => (
                            <button
                                key={cond.value}
                                onClick={() => handleConditionFilter(cond.value)}
                                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                    currentFilters.condition === cond.value
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {cond.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Disponibilidad */}
            <div className='mb-6 border-b pb-4'>
                <button
                    onClick={() => toggleSection('availability')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Disponibilidad</span>
                    <span className='material-symbols-outlined'>
                        {expanded.availability ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.availability && (
                    <div className='space-y-2'>
                        {[
                            { value: 'en-stock', label: 'En Stock' },
                            { value: 'bajo-pedido', label: 'Bajo Pedido' }
                        ].map(avail => (
                            <button
                                key={avail.value}
                                onClick={() => handleAvailabilityFilter(avail.value)}
                                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                    currentFilters.availability === avail.value
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {avail.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Colores */}
            {colors.length > 0 && (
                <div className='mb-6 border-b pb-4'>
                    <button
                        onClick={() => toggleSection('colors')}
                        className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                    >
                        <span>Colores</span>
                        <span className='material-symbols-outlined'>
                            {expanded.colors ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>
                    {expanded.colors && (
                        <div className='grid grid-cols-3 gap-2'>
                            {colors.map((color) => {
                                const isSelected = currentFilters.colors?.includes(color.name);
                                return (
                                    <button
                                        key={color.name}
                                        onClick={() => handleColorFilter(color.name)}
                                        className={`flex flex-col items-center gap-1 p-2 rounded transition-all ${
                                            isSelected ? 'bg-gray-100 ring-2 ring-primary' : 'hover:bg-gray-50'
                                        }`}
                                        title={color.name}
                                    >
                                        <div 
                                            className='w-8 h-8 rounded-full border-2 border-gray-300'
                                            style={{backgroundColor: color.hex}}
                                        />
                                        <span className='text-xs text-gray-600 truncate w-full text-center'>
                                            {color.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div>
                    <button
                        onClick={() => toggleSection('tags')}
                        className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                    >
                        <span>Etiquetas</span>
                        <span className='material-symbols-outlined'>
                            {expanded.tags ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>
                    {expanded.tags && (
                        <div className='flex flex-wrap gap-2 max-h-48 overflow-y-auto'>
                            {tags.map((tag) => {
                                const isSelected = currentFilters.tags?.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagFilter(tag)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            isSelected
                                                ? 'bg-primary text-white'
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                        }`}
                                    >
                                        #{tag}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Rango de Precio */}
            <div>
                <button
                    onClick={() => toggleSection('price')}
                    className='w-full flex items-center justify-between font-bold text-secondary mb-3'
                >
                    <span>Precio</span>
                    <span className='material-symbols-outlined'>
                        {expanded.price ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {expanded.price && (
                    <div className='space-y-3'>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>Mínimo (€)</label>
                            <input
                                type='number'
                                name='min'
                                value={priceRange.min}
                                onChange={handlePriceChange}
                                min='0'
                                className='w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none'
                            />
                        </div>
                        <div>
                            <label className='block text-sm text-gray-600 mb-1'>Máximo (€)</label>
                            <input
                                type='number'
                                name='max'
                                value={priceRange.max}
                                onChange={handlePriceChange}
                                min='0'
                                className='w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none'
                            />
                        </div>
                        <div className='text-sm text-gray-600 text-center'>
                            {priceRange.min}€ - {priceRange.max}€
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;

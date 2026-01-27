const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const productById = require('../middleware/productById');
const _ = require('lodash');

// @route   GET api/product/list
// @desc    Get a list of products with filter options
// @access  Public
router.get('/list', async (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        let products = await Product.find({})
            .populate('category')
            .sort([[sortBy, order]])
            .limit(limit)
            .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Invalid querys');
    }
});

// @route   GET api/product/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        let products = await Product.find({ featured: true })
            .populate('category')
            .sort([['createdAt', 'desc']])
            .limit(8)
            .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener productos destacados');
    }
});

// @route   GET api/product/search-suggestions
// @desc    Get search suggestions (products, categories, brands)
// @access  Public
router.get('/search-suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        const searchRegex = new RegExp(q, 'i');
        const Category = require('../models/Category');
        const Brand = require('../models/Brand');

        // Buscar productos (máx 5)
        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { sku: searchRegex }
            ],
            isActive: true
        })
            .select('name price images')
            .limit(5)
            .lean();

        // Buscar categorías (máx 3)
        const categories = await Category.find({
            name: searchRegex,
            isActive: true
        })
            .select('name slug')
            .limit(3)
            .lean();

        // Buscar marcas (máx 3)
        const brands = await Brand.find({
            name: searchRegex
        })
            .select('name')
            .limit(3)
            .lean();

        // Combinar resultados
        const suggestions = [
            ...products.map(p => ({ ...p, type: 'product' })),
            ...categories.map(c => ({ ...c, type: 'category' })),
            ...brands.map(b => ({ ...b, type: 'brand' }))
        ];

        res.json(suggestions);
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   GET api/product/by-category/:slug
// @desc    Get products by category slug (includes subcategories)
// @access  Public
router.get('/by-category/:slug', async (req, res) => {
    try {
        const Category = require('../models/Category');
        
        // Buscar la categoría por slug y popular el parent
        const category = await Category.findOne({ slug: req.params.slug }).populate('parent');
        
        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        // Buscar todas las subcategorías de esta categoría
        const subcategories = await Category.find({ parent: category._id, isActive: true });
        
        // IDs de categoría y subcategorías
        const categoryIds = [category._id, ...subcategories.map(sub => sub._id)];
        
        // Buscar productos que pertenezcan a la categoría o sus subcategorías
        const products = await Product.find({ 
            category: { $in: categoryIds },
            isActive: true 
        })
            .populate('category')
            .sort([['createdAt', 'desc']])
            .exec();
        
        res.json({
            category: category,
            subcategories: subcategories,
            products: products
        });
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET api/product/categories
// @desc    Get a list categories of products
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        let categories = await Product.distinct('category');
        if (!categories) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/product/filter
// @desc    filter a Product by price and category
// @access  Public
router.post('/filter', async (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    try {
        let products = await Product.find(findArgs)
            .select('-photo')
            .populate('category')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Products not found');
    }
});

// @route   GET api/product/search
// @desc    Get a list products by search query
// @access  Public
router.get('/search', async (req, res) => {
    const query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
    }

    try {
        const products = await Product.find(query).select('-photo');
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/product
// @desc    Create a Product
// @access  Private Admin
router.post('/', auth, adminAuth, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                error: 'Name, description, price and category are required'
            });
        }

        // Subir imágenes a Cloudinary
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'electromartinez/products',
                    resource_type: 'image'
                });
                
                imageUrls.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // Parsear campos JSON
        const parseJSON = (field) => {
            try {
                return field ? JSON.parse(field) : undefined;
            } catch (e) {
                console.log('Error parsing JSON field:', field, e.message);
                return field;
            }
        };

        // Convertir a número si existe, sino undefined
        const toNumber = (value) => {
            if (value === undefined || value === null || value === '') return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

        // Parsear y normalizar discount
        const parseDiscount = (discountField) => {
            if (!discountField) return undefined;
            const discount = parseJSON(discountField);
            if (!discount) return undefined;
            return {
                active: discount.active === true || discount.active === 'true',
                percentage: toNumber(discount.percentage),
                originalPrice: toNumber(discount.originalPrice),
                startDate: discount.startDate || null,
                endDate: discount.endDate || null
            };
        };

        const product = new Product({
            name,
            description,
            price: toNumber(price),
            category,
            images: imageUrls,
            
            // Campos básicos opcionales
            sku: req.body.sku,
            brand: req.body.brand,
            manufacturer: req.body.manufacturer,
            model: req.body.model,
            condition: req.body.condition || 'nuevo',
            
            // Stock
            quantity: toNumber(req.body.quantity) || 0,
            minStock: toNumber(req.body.minStock) || 5,
            maxStock: toNumber(req.body.maxStock),
            availability: req.body.availability || 'en-stock',
            warehouseLocation: req.body.warehouseLocation,
            supplier: req.body.supplier,
            restockDays: toNumber(req.body.restockDays),
            
            // Descuentos y precios
            discount: parseDiscount(req.body.discount),
            costPrice: toNumber(req.body.costPrice),
            wholesalePrice: toNumber(req.body.wholesalePrice),
            
            // Arrays
            specifications: parseJSON(req.body.specifications) || [],
            highlights: parseJSON(req.body.highlights) || [],
            packageContents: parseJSON(req.body.packageContents) || [],
            tags: parseJSON(req.body.tags) || [],
            colors: parseJSON(req.body.colors) || [],
            sizes: parseJSON(req.body.sizes) || [],
            connectivity: parseJSON(req.body.connectivity) || [],
            
            // Variantes
            material: req.body.material,
            
            // Dimensiones
            weight: toNumber(req.body.weight),
            dimensions: parseJSON(req.body.dimensions),
            
            // Envío
            shipping: req.body.shipping === 'true' || req.body.shipping === true,
            freeShipping: req.body.freeShipping === 'true' || req.body.freeShipping === true,
            deliveryTime: req.body.deliveryTime,
            isFragile: req.body.isFragile === 'true' || req.body.isFragile === true,
            requiresInstallation: req.body.requiresInstallation === 'true' || req.body.requiresInstallation === true,
            
            // Características técnicas
            energyClass: req.body.energyClass,
            warranty: req.body.warranty,
            operatingSystem: req.body.operatingSystem,
            processor: req.body.processor,
            ram: req.body.ram,
            storage: req.body.storage,
            powerConsumption: req.body.powerConsumption,
            
            // Otros
            featured: req.body.featured === 'true' || req.body.featured === true,
            badge: req.body.badge,
            videoUrl: req.body.videoUrl,
            manualPdfUrl: req.body.manualPdfUrl,
            usageType: req.body.usageType,
            productLine: req.body.productLine,
            secondaryCategory: req.body.secondaryCategory,
            
            // SEO
            seo: parseJSON(req.body.seo),
            
            isActive: req.body.isActive !== 'false'
        });

        await product.save();
        res.json({ message: 'Product Created Successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        console.error('Error details:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        res.status(500).json({ 
            error: error.message || 'Server error',
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : undefined
        });
    }
});

// @route   GET api/product/:productId
// @desc    Get a Product information
// @access  Public
router.get('/:productId', productById, (req, res) => {
    return res.json(req.product);
});



// @route   DELETE api/product/:productId
// @desc    Delete a Product
// @access  Private Admin
router.delete('/:productId', auth, adminAuth, productById, async (req, res) => {
    let product = req.product;
    try {
        // Eliminar imágenes de Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }
        
        let deletedProduct = await product.remove();
        res.json({
            message: `${deletedProduct.name} deleted successfully`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/product/:productId
// @desc    Update Single product
// @access  Private Admin
router.put('/:productId', auth, adminAuth, productById, upload.array('images', 5), async (req, res) => {
    try {
        let product = req.product;

        // LOG para debug
        console.log('=== PUT REQUEST DEBUG ===');
        console.log('specifications recibidas:', req.body.specifications);
        console.log('highlights recibidos:', req.body.highlights);
        console.log('tags recibidos:', req.body.tags);

        // Parsear campos JSON
        const parseJSON = (field) => {
            try {
                return field ? JSON.parse(field) : undefined;
            } catch (e) {
                console.log('Error parsing JSON field:', field, e.message);
                return field;
            }
        };

        // Convertir a número si existe, sino undefined
        const toNumber = (value) => {
            if (value === undefined || value === null || value === '') return undefined;
            const num = Number(value);
            return isNaN(num) ? undefined : num;
        };

        // Parsear y normalizar discount
        const parseDiscount = (discountField) => {
            if (!discountField) return undefined;
            const discount = parseJSON(discountField);
            if (!discount) return undefined;
            return {
                active: discount.active === true || discount.active === 'true',
                percentage: toNumber(discount.percentage),
                originalPrice: toNumber(discount.originalPrice),
                startDate: discount.startDate || null,
                endDate: discount.endDate || null
            };
        };

        // Actualizar campos básicos
        if (req.body.name) product.name = req.body.name;
        if (req.body.description) product.description = req.body.description;
        if (req.body.price !== undefined) product.price = toNumber(req.body.price);
        if (req.body.category) product.category = req.body.category;
        
        // Campos básicos opcionales
        if (req.body.sku !== undefined) product.sku = req.body.sku;
        if (req.body.brand !== undefined) product.brand = req.body.brand;
        if (req.body.manufacturer !== undefined) product.manufacturer = req.body.manufacturer;
        if (req.body.model !== undefined) product.model = req.body.model;
        if (req.body.condition !== undefined) product.condition = req.body.condition;
        
        // Stock
        if (req.body.quantity !== undefined) product.quantity = toNumber(req.body.quantity);
        if (req.body.minStock !== undefined) product.minStock = toNumber(req.body.minStock);
        if (req.body.maxStock !== undefined) product.maxStock = toNumber(req.body.maxStock);
        if (req.body.availability !== undefined) product.availability = req.body.availability;
        if (req.body.warehouseLocation !== undefined) product.warehouseLocation = req.body.warehouseLocation;
        if (req.body.supplier !== undefined) product.supplier = req.body.supplier;
        if (req.body.restockDays !== undefined) product.restockDays = toNumber(req.body.restockDays);
        
        // Descuentos y precios
        if (req.body.discount !== undefined) product.discount = parseDiscount(req.body.discount);
        if (req.body.costPrice !== undefined) product.costPrice = toNumber(req.body.costPrice);
        if (req.body.wholesalePrice !== undefined) product.wholesalePrice = toNumber(req.body.wholesalePrice);
        
        // Arrays - siempre actualizar (permite vaciar arrays)
        if (req.body.specifications !== undefined) product.specifications = parseJSON(req.body.specifications) || [];
        if (req.body.highlights !== undefined) product.highlights = parseJSON(req.body.highlights) || [];
        if (req.body.packageContents !== undefined) product.packageContents = parseJSON(req.body.packageContents) || [];
        if (req.body.tags !== undefined) product.tags = parseJSON(req.body.tags) || [];
        if (req.body.colors !== undefined) product.colors = parseJSON(req.body.colors) || [];
        if (req.body.sizes !== undefined) product.sizes = parseJSON(req.body.sizes) || [];
        if (req.body.connectivity !== undefined) product.connectivity = parseJSON(req.body.connectivity) || [];
        
        // Variantes
        if (req.body.material !== undefined) product.material = req.body.material;
        
        // Dimensiones
        if (req.body.weight !== undefined) product.weight = toNumber(req.body.weight);
        if (req.body.dimensions !== undefined) product.dimensions = parseJSON(req.body.dimensions);
        
        // Envío
        if (req.body.shipping !== undefined) product.shipping = req.body.shipping === 'true' || req.body.shipping === true;
        if (req.body.freeShipping !== undefined) product.freeShipping = req.body.freeShipping === 'true' || req.body.freeShipping === true;
        if (req.body.deliveryTime !== undefined) product.deliveryTime = req.body.deliveryTime;
        if (req.body.isFragile !== undefined) product.isFragile = req.body.isFragile === 'true' || req.body.isFragile === true;
        if (req.body.requiresInstallation !== undefined) product.requiresInstallation = req.body.requiresInstallation === 'true' || req.body.requiresInstallation === true;
        
        // Características técnicas
        if (req.body.energyClass !== undefined) product.energyClass = req.body.energyClass;
        if (req.body.warranty !== undefined) product.warranty = req.body.warranty;
        if (req.body.operatingSystem !== undefined) product.operatingSystem = req.body.operatingSystem;
        if (req.body.processor !== undefined) product.processor = req.body.processor;
        if (req.body.ram !== undefined) product.ram = req.body.ram;
        if (req.body.storage !== undefined) product.storage = req.body.storage;
        if (req.body.powerConsumption !== undefined) product.powerConsumption = req.body.powerConsumption;
        
        // Otros
        if (req.body.featured !== undefined) product.featured = req.body.featured === 'true' || req.body.featured === true;
        if (req.body.badge !== undefined) product.badge = req.body.badge;
        if (req.body.videoUrl !== undefined) product.videoUrl = req.body.videoUrl;
        if (req.body.manualPdfUrl !== undefined) product.manualPdfUrl = req.body.manualPdfUrl;
        if (req.body.usageType !== undefined) product.usageType = req.body.usageType;
        if (req.body.productLine !== undefined) product.productLine = req.body.productLine;
        if (req.body.secondaryCategory !== undefined) product.secondaryCategory = req.body.secondaryCategory;
        
        // SEO
        if (req.body.seo !== undefined) product.seo = parseJSON(req.body.seo);
        
        if (req.body.isActive !== undefined) product.isActive = req.body.isActive !== 'false';

        // Eliminar imágenes específicas si se solicita
        if (req.body.removeImages) {
            const imagesToRemove = Array.isArray(req.body.removeImages) ? req.body.removeImages : JSON.parse(req.body.removeImages);
            for (const publicId of imagesToRemove) {
                await cloudinary.uploader.destroy(publicId);
                product.images = product.images.filter(img => img.public_id !== publicId);
            }
        }

        // Subir nuevas imágenes
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'electromartinez/products',
                    resource_type: 'image'
                });
                
                product.images.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        let productDetails = await product.save();
        res.json(productDetails);
    } catch (error) {
        console.error('Error updating product:', error);
        console.error('Error details:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        res.status(500).json({ 
            error: error.message || 'Server error',
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : undefined
        });
    }
});

// @route   POST api/product/:id/view
// @desc    Track product view (for logged users)
// @access  Private
router.post('/:id/view', auth, async (req, res) => {
    try {
        const ViewedProduct = require('../models/ViewedProduct');
        
        const existing = await ViewedProduct.findOne({
            user: req.user.id,
            product: req.params.id
        });

        if (existing) {
            existing.viewCount += 1;
            existing.lastViewed = Date.now();
            await existing.save();
        } else {
            await ViewedProduct.create({
                user: req.user.id,
                product: req.params.id
            });
        }

        res.json({ message: 'View tracked' });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET api/product/recommendations
// @desc    Get personalized product recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
    try {
        const ViewedProduct = require('../models/ViewedProduct');
        const Order = require('../models/Order');
        const Category = require('../models/Category');

        // Obtener productos vistos recientemente (últimos 30 días)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const viewedProducts = await ViewedProduct.find({
            user: req.user.id,
            lastViewed: { $gte: thirtyDaysAgo }
        })
            .populate('product', 'category')
            .sort({ lastViewed: -1, viewCount: -1 })
            .limit(10);

        // Obtener productos de pedidos pasados
        const orders = await Order.find({
            user: req.user.id
        })
            .populate('items.product', 'category')
            .sort({ createdAt: -1 })
            .limit(5);

        // Extraer categorías favoritas
        const categoryMap = {};
        
        viewedProducts.forEach(vp => {
            if (vp.product && vp.product.category) {
                const catId = vp.product.category.toString();
                categoryMap[catId] = (categoryMap[catId] || 0) + vp.viewCount;
            }
        });

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && item.product.category) {
                    const catId = item.product.category.toString();
                    categoryMap[catId] = (categoryMap[catId] || 0) + 3; // Mayor peso a compras
                }
            });
        });

        // Ordenar categorías por relevancia
        const topCategories = Object.entries(categoryMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([catId]) => catId);

        // IDs de productos ya vistos/comprados (para excluir)
        const excludeIds = [
            ...viewedProducts.map(vp => vp.product?._id).filter(Boolean),
            ...orders.flatMap(o => o.items.map(i => i.product?._id)).filter(Boolean)
        ];

        // Buscar productos recomendados
        let recommendations = [];

        if (topCategories.length > 0) {
            recommendations = await Product.find({
                category: { $in: topCategories },
                _id: { $nin: excludeIds },
                isActive: true,
                quantity: { $gt: 0 }
            })
                .populate('category')
                .sort({ createdAt: -1 })
                .limit(12);
        }

        // Si no hay suficientes recomendaciones, añadir productos populares
        if (recommendations.length < 8) {
            const popular = await Product.find({
                _id: { $nin: [...excludeIds, ...recommendations.map(r => r._id)] },
                isActive: true,
                quantity: { $gt: 0 }
            })
                .populate('category')
                .sort({ createdAt: -1 })
                .limit(12 - recommendations.length);
            
            recommendations = [...recommendations, ...popular];
        }

        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET api/product/recently-viewed
// @desc    Get user's recently viewed products
// @access  Private
router.get('/recently-viewed', auth, async (req, res) => {
    try {
        const ViewedProduct = require('../models/ViewedProduct');
        const limit = parseInt(req.query.limit) || 8;

        const viewed = await ViewedProduct.find({ user: req.user.id })
            .populate({
                path: 'product',
                populate: { path: 'category' }
            })
            .sort({ lastViewed: -1 })
            .limit(limit);

        const products = viewed
            .map(v => v.product)
            .filter(p => p && p.isActive);

        res.json(products);
    } catch (error) {
        console.error('Error getting recently viewed:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.param("productId", productById);

module.exports = router;

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const categoryById = require('../middleware/categoryById');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const cloudinary = require('cloudinary').v2;

// @route   POST api/category
// @desc    Create Category
// @access  Private Admin
router.post('/', auth, adminAuth, (req, res, next) => {
    console.log('\n=== POST CATEGORY - ANTES DE MULTER ===');
    console.log('Headers:', req.headers);
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer:', err.message);
            return res.status(400).json({ error: err.message });
        }
        console.log('✅ Multer procesado correctamente');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        next();
    });
}, [
    check('name', 'Name is required').trim().not().isEmpty()
], async (req, res) => {
    console.log('\n=== POST CATEGORY - EN HANDLER ===');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('❌ Errores de validación:', errors.array());
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    const { name, description, parent, order, isActive } = req.body;
    console.log('Datos extraídos:', { name, description, parent, order, isActive });
    try {
        let category = await Category.findOne({ name });

        if (category) {
            return res.status(403).json({
                error: 'Category already exist'
            });
        }

        let imageData = null;
        if (req.file) {
            console.log('📤 Subiendo imagen a Cloudinary...');
            console.log('File info:', { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
            // Subir imagen a Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'categories' },
                    (error, result) => {
                        if (error) {
                            console.error('❌ Error subiendo a Cloudinary:', error);
                            reject(error);
                        } else {
                            console.log('✅ Imagen subida a Cloudinary:', result.secure_url);
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            
            imageData = {
                url: result.secure_url,
                public_id: result.public_id
            };
        } else {
            console.log('ℹ️ No se recibió archivo de imagen');
        }

        const newCategory = new Category({ 
            name, 
            description,
            parent: parent || null,
            image: imageData,
            order: Number(order) || 0,
            isActive: isActive === 'true' || isActive === true
        });
        console.log('💾 Guardando categoría:', newCategory);
        category = await newCategory.save();
        console.log('✅ Categoría guardada exitosamente:', category._id);
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

// @route   GET api/category/all
// @desc    Get all categories with hierarchy
// @access  Public
router.get('/all', async (req, res) => {
    try {
        let data = await Category.find({}).populate('parent', 'name').sort({ order: 1, name: 1 });
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

// @route   GET api/category/tree
// @desc    Get categories in tree structure
// @access  Public
router.get('/tree', async (req, res) => {
    try {
        // Obtener categorías raíz (sin parent)
        const rootCategories = await Category.find({ parent: null }).sort({ order: 1, name: 1 });
        
        // Función recursiva para construir árbol
        const buildTree = async (parentId) => {
            const children = await Category.find({ parent: parentId }).sort({ order: 1, name: 1 });
            return Promise.all(children.map(async (child) => ({
                ...child.toObject(),
                children: await buildTree(child._id)
            })));
        };

        const tree = await Promise.all(rootCategories.map(async (root) => ({
            ...root.toObject(),
            children: await buildTree(root._id)
        })));

        res.json(tree);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

// @route   GET api/category/:categoryId
// @desc    Get Single category
// @access  Public
router.get('/:categoryId', categoryById, async (req, res) => {
    res.json(req.category);
});

// @route   PUT api/category/:categoryId
// @desc    Update Single category
// @access  Private Admin
router.put('/:categoryId', auth, adminAuth, (req, res, next) => {
    console.log('\n=== PUT CATEGORY - ANTES DE MULTER ===');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer:', err.message);
            return res.status(400).json({ error: err.message });
        }
        console.log('✅ Multer procesado correctamente');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        next();
    });
}, categoryById, async (req, res) => {
    let category = req.category;
    
    console.log('=== PUT CATEGORY DEBUG ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    
    const { name, description, parent, order, isActive } = req.body;
    
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (parent !== undefined) category.parent = parent || null;
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) {
        category.isActive = isActive === 'true' || isActive === true;
    }

    try {
        // Si se sube una nueva imagen
        if (req.file) {
            console.log('📤 Subiendo imagen a Cloudinary...');
            console.log('File info:', { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
            // Eliminar imagen antigua de Cloudinary si existe
            if (category.image && category.image.public_id) {
                console.log('🗑️ Eliminando imagen antigua:', category.image.public_id);
                await cloudinary.uploader.destroy(category.image.public_id);
            }

            // Subir nueva imagen
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'categories' },
                    (error, result) => {
                        if (error) {
                            console.error('❌ Error subiendo a Cloudinary:', error);
                            reject(error);
                        } else {
                            console.log('✅ Imagen subida a Cloudinary:', result.secure_url);
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            
            category.image = {
                url: result.secure_url,
                public_id: result.public_id
            };
        } else {
            console.log('ℹ️ No se recibió nueva imagen');
        }

        console.log('💾 Guardando cambios en categoría...');
        category = await category.save();
        console.log('✅ Categoría actualizada exitosamente');
        res.json(category);
    } catch (error) {
        console.error('❌ ERROR EN PUT CATEGORY:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// @route   DELETE api/category/:categoryId
// @desc    Delete Single category
// @access  Private Admin
router.delete('/:categoryId', auth, adminAuth, categoryById, async (req, res) => {
    let category = req.category;
    try {
        let deletedCategory = await category.remove();
        res.json({
            message: `${deletedCategory.name} deleted successfully`
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

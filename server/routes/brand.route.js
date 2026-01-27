const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const brandById = require('../middleware/brandById');
const { check, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const cloudinary = require('cloudinary').v2;

// @route   POST api/brand
// @desc    Create Brand
// @access  Private Admin
router.post('/', auth, adminAuth, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer:', err.message);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, [
    check('name', 'Name is required').trim().not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    const { name, description, website, order, isActive } = req.body;
    
    try {
        let brand = await Brand.findOne({ name });

        if (brand) {
            return res.status(403).json({
                error: 'Brand already exists'
            });
        }

        let imageData = null;
        
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'brands' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                
                imageData = {
                    url: result.secure_url,
                    public_id: result.public_id
                };
            } catch (uploadError) {
                console.error('Error subiendo imagen a Cloudinary:', uploadError);
                return res.status(500).json({ error: 'Error al subir la imagen' });
            }
        }

        brand = new Brand({
            name,
            description,
            website,
            image: imageData,
            order: order ? Number(order) : 0,
            isActive: isActive === 'true' || isActive === true
        });

        await brand.save();
        res.json(brand);
    } catch (error) {
        console.error('Error creando marca:', error);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/brand/all
// @desc    Get all brands
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const brands = await Brand.find({})
            .sort({ order: 1, name: 1 });
        res.json(brands);
    } catch (error) {
        console.error('Error obteniendo marcas:', error);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/brand/:brandId
// @desc    Get brand by ID
// @access  Public
router.get('/:brandId', brandById, (req, res) => {
    res.json(req.brand);
});

// @route   PUT api/brand/:brandId
// @desc    Update brand
// @access  Private Admin
router.put('/:brandId', auth, adminAuth, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer:', err.message);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, brandById, async (req, res) => {
    const { name, description, website, order, isActive } = req.body;
    
    try {
        const brand = req.brand;

        if (name) brand.name = name;
        if (description !== undefined) brand.description = description;
        if (website !== undefined) brand.website = website;
        if (order !== undefined) brand.order = Number(order);
        if (isActive !== undefined) brand.isActive = isActive === 'true' || isActive === true;

        // Si hay nueva imagen
        if (req.file) {
            // Eliminar imagen antigua si existe
            if (brand.image && brand.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(brand.image.public_id);
                } catch (err) {
                    console.error('Error eliminando imagen antigua:', err);
                }
            }

            // Subir nueva imagen
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'brands' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                
                brand.image = {
                    url: result.secure_url,
                    public_id: result.public_id
                };
            } catch (uploadError) {
                console.error('Error subiendo imagen a Cloudinary:', uploadError);
                return res.status(500).json({ error: 'Error al subir la imagen' });
            }
        }

        await brand.save();
        res.json(brand);
    } catch (error) {
        console.error('Error actualizando marca:', error);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/brand/:brandId
// @desc    Delete brand
// @access  Private Admin
router.delete('/:brandId', auth, adminAuth, brandById, async (req, res) => {
    try {
        const brand = req.brand;

        // Eliminar imagen de Cloudinary si existe
        if (brand.image && brand.image.public_id) {
            try {
                await cloudinary.uploader.destroy(brand.image.public_id);
            } catch (err) {
                console.error('Error eliminando imagen de Cloudinary:', err);
            }
        }

        await Brand.findByIdAndDelete(brand._id);
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Error eliminando marca:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

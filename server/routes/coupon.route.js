const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Middleware para verificar si es admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 1) {  // role es Number (1 = admin)
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requiere rol de administrador'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar permisos'
        });
    }
};

// @route   POST /api/coupon/validate
// @desc    Validar cupón
// @access  Public
router.post('/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        if (!code || !subtotal) {
            return res.status(400).json({
                success: false,
                message: 'Código y subtotal son obligatorios'
            });
        }

        // Buscar cupón
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Cupón no encontrado'
            });
        }

        // Verificar validez
        const validation = coupon.isValid();
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        // Calcular descuento
        const discountResult = coupon.calculateDiscount(subtotal);

        if (!discountResult.applicable) {
            return res.status(400).json({
                success: false,
                message: discountResult.message
            });
        }

        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                discount: coupon.discount,
                description: coupon.description
            },
            discountAmount: discountResult.discount,
            message: discountResult.message
        });

    } catch (error) {
        console.error('Error validando cupón:', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el cupón'
        });
    }
});

// @route   POST /api/coupon/apply
// @desc    Aplicar cupón (incrementar contador de uso)
// @access  Private
router.post('/apply/:code', auth, async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Cupón no encontrado'
            });
        }

        // Incrementar contador de uso
        coupon.usedCount += 1;
        await coupon.save();

        res.json({
            success: true,
            message: 'Cupón aplicado exitosamente'
        });

    } catch (error) {
        console.error('Error aplicando cupón:', error);
        res.status(500).json({
            success: false,
            message: 'Error al aplicar el cupón'
        });
    }
});

// @route   GET /api/coupon/admin
// @desc    Listar todos los cupones (Admin)
// @access  Private/Admin
router.get('/admin', auth, isAdmin, async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        res.json({
            success: true,
            count: coupons.length,
            coupons
        });

    } catch (error) {
        console.error('Error obteniendo cupones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener cupones'
        });
    }
});

// @route   POST /api/coupon/admin
// @desc    Crear cupón (Admin)
// @access  Private/Admin
router.post('/admin', auth, isAdmin, async (req, res) => {
    try {
        const couponData = {
            ...req.body,
            createdBy: req.user._id
        };

        const coupon = await Coupon.create(couponData);

        res.status(201).json({
            success: true,
            coupon,
            message: 'Cupón creado exitosamente'
        });

    } catch (error) {
        console.error('Error creando cupón:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un cupón con ese código'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear el cupón',
            error: error.message
        });
    }
});

// @route   GET /api/coupon/admin/:id
// @desc    Obtener cupón por ID (Admin)
// @access  Private/Admin
router.get('/admin/:id', auth, isAdmin, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('applicableCategories', 'name')
            .populate('applicableBrands', 'name');

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Cupón no encontrado'
            });
        }

        res.json({
            success: true,
            coupon
        });

    } catch (error) {
        console.error('Error obteniendo cupón:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el cupón'
        });
    }
});

// @route   PUT /api/coupon/admin/:id
// @desc    Actualizar cupón (Admin)
// @access  Private/Admin
router.put('/admin/:id', auth, isAdmin, async (req, res) => {
    try {
        let coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Cupón no encontrado'
            });
        }

        coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            coupon,
            message: 'Cupón actualizado exitosamente'
        });

    } catch (error) {
        console.error('Error actualizando cupón:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el cupón',
            error: error.message
        });
    }
});

// @route   DELETE /api/coupon/admin/:id
// @desc    Eliminar cupón (Admin)
// @access  Private/Admin
router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Cupón no encontrado'
            });
        }

        await coupon.deleteOne();

        res.json({
            success: true,
            message: 'Cupón eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error eliminando cupón:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el cupón'
        });
    }
});

module.exports = router;

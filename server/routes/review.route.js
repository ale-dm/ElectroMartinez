const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   GET /api/review/product/:productId
// @desc    Obtener todas las reseñas de un producto
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        
        res.json(reviews);
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   POST /api/review
// @desc    Crear una reseña
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { product, rating, title, comment } = req.body;

        // Validar campos
        if (!product || !rating || !title || !comment) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ msg: 'La calificación debe estar entre 1 y 5' });
        }

        // Verificar si el producto existe
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificar si el usuario ya dejó una reseña para este producto
        const existingReview = await Review.findOne({
            product,
            user: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({ msg: 'Ya has dejado una reseña para este producto' });
        }

        // Verificar si el usuario compró este producto
        const hasPurchased = await Order.findOne({
            user: req.user.id,
            'items.product': product,
            orderStatus: { $in: ['confirmado', 'procesando', 'enviado', 'entregado'] }
        });

        // Crear la reseña
        const review = new Review({
            product,
            user: req.user.id,
            rating,
            title,
            comment,
            isVerifiedPurchase: !!hasPurchased
        });

        await review.save();

        // Actualizar el promedio de calificación del producto
        await updateProductRating(product);

        // Poblar el usuario antes de devolver
        await review.populate('user', 'name');

        res.json(review);
    } catch (error) {
        console.error('Error al crear reseña:', error);
        if (error.code === 11000) {
            return res.status(400).json({ msg: 'Ya has dejado una reseña para este producto' });
        }
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   PUT /api/review/:id
// @desc    Actualizar una reseña
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { rating, title, comment } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Reseña no encontrada' });
        }

        // Verificar que el usuario sea el autor
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'No tienes permiso para editar esta reseña' });
        }

        // Actualizar campos
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ msg: 'La calificación debe estar entre 1 y 5' });
            }
            review.rating = rating;
        }
        if (title) review.title = title;
        if (comment) review.comment = comment;

        await review.save();

        // Actualizar el promedio de calificación del producto
        await updateProductRating(review.product);

        await review.populate('user', 'name');

        res.json(review);
    } catch (error) {
        console.error('Error al actualizar reseña:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   DELETE /api/review/:id
// @desc    Eliminar una reseña
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Reseña no encontrada' });
        }

        // Verificar que el usuario sea el autor o admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'No tienes permiso para eliminar esta reseña' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Actualizar el promedio de calificación del producto
        await updateProductRating(productId);

        res.json({ msg: 'Reseña eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar reseña:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   PUT /api/review/:id/helpful
// @desc    Marcar una reseña como útil
// @access  Private
router.put('/:id/helpful', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Reseña no encontrada' });
        }

        review.helpful += 1;
        await review.save();

        res.json(review);
    } catch (error) {
        console.error('Error al marcar reseña como útil:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// Función auxiliar para actualizar el promedio de calificación de un producto
async function updateProductRating(productId) {
    try {
        const reviews = await Review.find({ product: productId });
        
        if (reviews.length === 0) {
            await Product.findByIdAndUpdate(productId, {
                'rating.average': 0,
                'rating.count': 0
            });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            'rating.average': Number(averageRating.toFixed(1)),
            'rating.count': reviews.length
        });
    } catch (error) {
        console.error('Error al actualizar rating del producto:', error);
    }
}

module.exports = router;

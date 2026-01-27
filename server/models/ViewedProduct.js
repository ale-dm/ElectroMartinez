const mongoose = require('mongoose');

const viewedProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    viewCount: {
        type: Number,
        default: 1
    },
    lastViewed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice compuesto para búsquedas rápidas
viewedProductSchema.index({ user: 1, product: 1 }, { unique: true });
viewedProductSchema.index({ user: 1, lastViewed: -1 });

module.exports = mongoose.model('ViewedProduct', viewedProductSchema);

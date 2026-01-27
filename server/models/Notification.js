const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['order_status', 'question_answered', 'promotion', 'price_drop', 'back_in_stock', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    relatedProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    }
}, {
    timestamps: true
});

// Índice compuesto para consultas frecuentes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

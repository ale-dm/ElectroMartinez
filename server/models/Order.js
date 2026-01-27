const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        image: String
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'España'
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        notes: String
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['transferencia', 'contrareembolso', 'tarjeta', 'stripe', 'paypal', 'revolut_pay', 'apple_pay', 'google_pay', 'card'],
        default: 'transferencia'
    },
    paymentStatus: {
        type: String,
        enum: ['pendiente', 'pagado', 'rechazado'],
        default: 'pendiente'
    },
    stripePaymentMethodId: {
        type: String,
        default: null
    },
    coupon: {
        code: String,
        discount: Number,
        type: String // 'percentage' o 'fixed'
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    itemsPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    orderStatus: {
        type: String,
        enum: ['pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    orderNumber: {
        type: String,
        unique: true
    },
    trackingNumber: String,
    deliveredAt: Date,
    notes: String
}, {
    timestamps: true
});

// Generar número de orden antes de guardar
orderSchema.pre('save', async function() {
    if (!this.orderNumber) {
        // Formato: ORD-YYYYMMDD-XXXXX (ej: ORD-20260124-00001)
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 90000) + 10000; // 5 dígitos
        this.orderNumber = `ORD-${year}${month}${day}-${random}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);

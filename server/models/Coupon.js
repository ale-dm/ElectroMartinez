const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'El código del cupón es obligatorio'],
        unique: true,
        uppercase: true,
        trim: true,
        minlength: [3, 'El código debe tener al menos 3 caracteres'],
        maxlength: [20, 'El código no puede exceder 20 caracteres']
    },
    discount: {
        type: Number,
        required: [true, 'El descuento es obligatorio'],
        min: [0, 'El descuento no puede ser negativo']
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage',
        required: true
    },
    minPurchase: {
        type: Number,
        default: 0,
        min: [0, 'La compra mínima no puede ser negativa']
    },
    maxDiscount: {
        type: Number,
        default: null,
        min: [0, 'El descuento máximo no puede ser negativo']
    },
    expiryDate: {
        type: Date,
        required: [true, 'La fecha de expiración es obligatoria']
    },
    usageLimit: {
        type: Number,
        default: null,
        min: [1, 'El límite de uso debe ser al menos 1']
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, 'El contador de uso no puede ser negativo']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'La descripción no puede exceder 200 caracteres']
    },
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    applicableBrands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    }],
    excludedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Índices para optimizar búsquedas
couponSchema.index({ isActive: 1, expiryDate: 1 });

// Método para verificar si el cupón es válido
couponSchema.methods.isValid = function() {
    const now = new Date();
    
    // Verificar si está activo
    if (!this.isActive) {
        return { valid: false, message: 'Este cupón no está disponible' };
    }
    
    // Verificar si ha expirado
    if (this.expiryDate < now) {
        return { valid: false, message: 'Este cupón ha expirado' };
    }
    
    // Verificar límite de uso
    if (this.usageLimit && this.usedCount >= this.usageLimit) {
        return { valid: false, message: 'Este cupón ha alcanzado su límite de uso' };
    }
    
    return { valid: true, message: 'Cupón válido' };
};

// Método para calcular el descuento
couponSchema.methods.calculateDiscount = function(subtotal, cart) {
    // Verificar compra mínima
    if (subtotal < this.minPurchase) {
        return {
            applicable: false,
            discount: 0,
            message: `Compra mínima requerida: ${this.minPurchase.toFixed(2)}€`
        };
    }
    
    // Calcular descuento según tipo
    let discountAmount = 0;
    
    if (this.type === 'percentage') {
        discountAmount = (subtotal * this.discount) / 100;
        
        // Aplicar descuento máximo si existe
        if (this.maxDiscount && discountAmount > this.maxDiscount) {
            discountAmount = this.maxDiscount;
        }
    } else {
        // Descuento fijo
        discountAmount = this.discount;
        
        // El descuento no puede ser mayor que el subtotal
        if (discountAmount > subtotal) {
            discountAmount = subtotal;
        }
    }
    
    return {
        applicable: true,
        discount: Math.round(discountAmount * 100) / 100,
        message: `Cupón aplicado: -${discountAmount.toFixed(2)}€`
    };
};

module.exports = mongoose.model('Coupon', couponSchema);

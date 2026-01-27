const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    // ===== CAMPOS BÁSICOS (REQUIRED) =====
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 5000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    
    // ===== CAMPOS BÁSICOS (OPCIONALES) =====
    sku: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        uppercase: true
    },
    brand: {
        type: String,
        trim: true,
        maxlength: 100
    },
    manufacturer: {
        type: String,
        trim: true,
        maxlength: 100
    },
    model: {
        type: String,
        trim: true,
        maxlength: 100
    },
    condition: {
        type: String,
        enum: ['nuevo', 'reacondicionado', 'exposicion', 'segunda-mano'],
        default: 'nuevo'
    },
    
    // ===== PRECIOS Y DESCUENTOS =====
    discount: {
        active: { type: Boolean, default: false },
        percentage: { type: Number, min: 0, max: 100 },
        originalPrice: Number,
        startDate: Date,
        endDate: Date
    },
    finalPrice: Number, // Precio con descuento aplicado
    isOnSale: { type: Boolean, default: false }, // Flag calculado
    costPrice: Number, // Precio de coste (solo admin)
    wholesalePrice: Number, // Precio por mayor
    
    // ===== STOCK Y LOGÍSTICA =====
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    minStock: {
        type: Number,
        default: 5
    },
    maxStock: Number,
    availability: {
        type: String,
        enum: ['en-stock', 'bajo-pedido', 'agotado', 'descontinuado'],
        default: 'en-stock'
    },
    warehouseLocation: String,
    supplier: String,
    restockDays: Number, // Días para reposición
    
    // ===== IMÁGENES Y MULTIMEDIA =====
    images: [{
        url: String,
        public_id: String,
        alt: String,
        isPrimary: Boolean
    }],
    videoUrl: String, // YouTube, Vimeo
    manualPdfUrl: String,
    
    // ===== ESPECIFICACIONES TÉCNICAS =====
    specifications: [{
        key: String,
        value: String,
        unit: String // ej: "W", "kg", "cm"
    }],
    highlights: [String], // Características destacadas (bullets)
    packageContents: [String], // Qué incluye la caja
    
    // ===== VARIANTES Y OPCIONES =====
    colors: [{
        name: String,
        hex: String,
        available: { type: Boolean, default: true }
    }],
    sizes: [String], // Tallas, capacidades (64GB, 128GB, etc.)
    material: String,
    
    // ===== DIMENSIONES Y PESO =====
    weight: Number, // kg
    dimensions: {
        height: Number, // cm
        width: Number,
        depth: Number
    },
    
    // ===== ENVÍO =====
    shipping: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    deliveryTime: String, // "24-48h", "3-5 días"
    isFragile: {
        type: Boolean,
        default: false
    },
    requiresInstallation: {
        type: Boolean,
        default: false
    },
    
    // ===== CARACTERÍSTICAS ESPECÍFICAS =====
    energyClass: {
        type: String,
        enum: ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', '']
    },
    warranty: String, // "2 años", "3 años"
    connectivity: [String], // WiFi, Bluetooth, USB-C, etc.
    operatingSystem: String,
    processor: String,
    ram: String,
    storage: String,
    powerConsumption: String,
    
    // ===== CATEGORIZACIÓN Y TAGS =====
    tags: [String],
    secondaryCategory: {
        type: ObjectId,
        ref: 'Category'
    },
    usageType: {
        type: String,
        enum: ['hogar', 'oficina', 'gaming', 'profesional', 'exterior', '']
    },
    productLine: {
        type: String,
        enum: ['linea-blanca', 'linea-marron', 'informatica', 'telefonia', 'audio', 'foto-video', '']
    },
    
    // ===== BADGES Y DESTACADOS =====
    featured: {
        type: Boolean,
        default: false
    },
    badge: {
        type: String,
        enum: ['', 'nuevo', 'oferta', 'mas-vendido', 'destacado', 'envio-gratis'],
        default: ''
    },
    
    // ===== REVIEWS Y POPULARIDAD =====
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    views: {
        type: Number,
        default: 0
    },
    lastSaleDate: Date,
    
    // ===== SEO =====
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
        slug: String
    },
    
    // ===== ESTADO DEL PRODUCTO =====
    isActive: {
        type: Boolean,
        default: true
    },
    publishDate: Date,
    
}, {
    timestamps: true
});

// Índices para mejorar búsquedas
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ brand: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ views: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ price: 1 });

// Virtual para verificar si tiene stock
productSchema.virtual('inStock').get(function() {
    return this.quantity > 0;
});

// Middleware pre-save para calcular descuentos AUTOMÁTICAMENTE
productSchema.pre('save', async function() {
    // Calcular si está en oferta
    const now = new Date();
    const hasActiveDiscount = this.discount?.active === true && 
                              this.discount?.percentage > 0;
    
    let isWithinDateRange = true;
    let hasStarted = true;
    
    // Verificar fecha de fin
    if (this.discount?.endDate) {
        const endDate = new Date(this.discount.endDate);
        isWithinDateRange = now <= endDate;
    }
    
    // Verificar fecha de inicio
    if (this.discount?.startDate) {
        const startDate = new Date(this.discount.startDate);
        hasStarted = now >= startDate;
    }
    
    // Establecer isOnSale
    this.isOnSale = hasActiveDiscount && isWithinDateRange && hasStarted;
    
    // Calcular precio final
    if (this.isOnSale && this.price) {
        const discountAmount = this.price * (this.discount.percentage / 100);
        this.finalPrice = this.price - discountAmount;
    } else {
        this.finalPrice = this.price;
    }
});

module.exports = mongoose.model('Product', productSchema);

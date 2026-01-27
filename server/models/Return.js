const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    returnNumber: {
        type: String,
        unique: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
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
            required: true
        },
        image: String,
        reason: {
            type: String,
            enum: ['defectuoso', 'no_funciona', 'diferente_al_pedido', 'danado_en_envio', 'no_lo_quiero', 'otro'],
            required: true
        }
    }],
    reason: {
        type: String,
        enum: [
            'defectuoso',           // Producto defectuoso
            'no_funciona',          // No funciona correctamente
            'diferente_al_pedido',  // Diferente a lo pedido
            'danado_en_envio',      // Llegó dañado
            'no_lo_quiero',         // Cambio de opinión
            'otro'                  // Otro motivo
        ],
        required: true
    },
    reasonDescription: {
        type: String,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: [
            'pendiente',    // Esperando revisión
            'aprobada',     // Aprobada, pendiente de recibir productos
            'recibida',     // Productos recibidos en almacén
            'inspeccion',   // En inspección de calidad
            'reembolsada',  // Reembolso completado
            'rechazada',    // Devolución rechazada
            'cancelada'     // Cancelada por el cliente
        ],
        default: 'pendiente'
    },
    refundAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    refundMethod: {
        type: String,
        enum: ['original', 'credito_tienda', 'transferencia'],
        default: 'original'
    },
    refundStatus: {
        type: String,
        enum: ['pendiente', 'procesando', 'completado', 'fallido'],
        default: 'pendiente'
    },
    refundedAt: Date,
    // Información de envío de devolución
    returnShipping: {
        carrier: String,        // Transportista
        trackingNumber: String, // Número de seguimiento
        returnLabel: String,    // URL de etiqueta de devolución
        shippedAt: Date,        // Fecha de envío
        receivedAt: Date        // Fecha de recepción en almacén
    },
    // Inspección del producto
    inspection: {
        inspectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        inspectedAt: Date,
        condition: {
            type: String,
            enum: ['nuevo', 'buen_estado', 'usado', 'danado', 'defectuoso']
        },
        notes: String,
        images: [String]  // Fotos del estado del producto
    },
    // Notas y comunicación
    customerNotes: String,
    adminNotes: String,
    // Historial de estados
    statusHistory: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],
    // Fechas importantes
    requestedAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: Date,
    completedAt: Date,
    // Límite para devolver (14 días por defecto)
    returnDeadline: {
        type: Date
    }
}, {
    timestamps: true
});

// Generar número de devolución antes de guardar
returnSchema.pre('save', async function() {
    if (!this.returnNumber) {
        // Formato: RMA-YYYYMMDD-XXXXX (ej: RMA-20260127-12345)
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 90000) + 10000;
        this.returnNumber = `RMA-${year}${month}${day}-${random}`;
    }
    
    // Calcular fecha límite de devolución si no existe (14 días desde aprobación)
    if (this.status === 'aprobada' && !this.returnDeadline) {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 14);
        this.returnDeadline = deadline;
    }

    // Actualizar historial de estados
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
        
        // Actualizar fechas según el estado
        if (this.status === 'aprobada') {
            this.approvedAt = new Date();
        } else if (this.status === 'reembolsada' || this.status === 'rechazada' || this.status === 'cancelada') {
            this.completedAt = new Date();
        }
        
        if (this.status === 'reembolsada') {
            this.refundedAt = new Date();
            this.refundStatus = 'completado';
        }
    }
});

// Virtual para calcular días restantes
returnSchema.virtual('daysRemaining').get(function() {
    if (!this.returnDeadline) return null;
    const now = new Date();
    const diff = this.returnDeadline - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Índices para búsquedas frecuentes
returnSchema.index({ user: 1, status: 1 });
returnSchema.index({ order: 1 });
returnSchema.index({ status: 1, createdAt: -1 });

// Métodos de motivos legibles
returnSchema.statics.getReasonLabel = function(reason) {
    const labels = {
        'defectuoso': 'Producto defectuoso',
        'no_funciona': 'No funciona correctamente',
        'diferente_al_pedido': 'Diferente a lo pedido',
        'danado_en_envio': 'Llegó dañado en el envío',
        'no_lo_quiero': 'Cambio de opinión',
        'otro': 'Otro motivo'
    };
    return labels[reason] || reason;
};

returnSchema.statics.getStatusLabel = function(status) {
    const labels = {
        'pendiente': 'Pendiente de revisión',
        'aprobada': 'Aprobada',
        'recibida': 'Producto recibido',
        'inspeccion': 'En inspección',
        'reembolsada': 'Reembolsado',
        'rechazada': 'Rechazada',
        'cancelada': 'Cancelada'
    };
    return labels[status] || status;
};

module.exports = mongoose.model('Return', returnSchema);

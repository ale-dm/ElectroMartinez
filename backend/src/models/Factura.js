const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  client: { type: String, required: true },
  items: [{
    descripcion: String,
    cantidad: Number,
    precio: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pendiente', 'pagada', 'anulada'], default: 'pendiente' },
  notes: String
});

module.exports = mongoose.model('Factura', facturaSchema);

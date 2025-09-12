const Factura = require('../models/Factura');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');

exports.crearFactura = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const { invoiceNumber, client, items, total, status, notes } = req.body;
    const factura = new Factura({ invoiceNumber, client, items, total, status, notes });
    await factura.save();
    res.status(201).json(factura);
  } catch (err) {
    next(err);
  }
};

exports.listarFacturas = async (req, res, next) => {
  try {
    const { page, limit, client, status } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const query = {};
    if (client) query.client = { $regex: client, $options: 'i' };
    if (status) query.status = status;
    const facturas = await Factura.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const total = await Factura.countDocuments(query);
    res.json({ total, page: pageNum, limit: limitNum, facturas });
  } catch (err) {
    next(err);
  }
};

exports.detalleFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findById(req.params.id);
    if (!factura) {
      const error = new Error('Factura no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json(factura);
  } catch (err) {
    next(err);
  }
};

exports.eliminarFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);
    if (!factura) {
      const error = new Error('Factura no encontrada');
      error.status = 404;
      return next(error);
    }
    res.json({ msg: 'Factura eliminada correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.descargarPDF = async (req, res, next) => {
  try {
    const factura = await Factura.findById(req.params.id);
    if (!factura) {
      const error = new Error('Factura no encontrada');
      error.status = 404;
      return next(error);
    }
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura_${factura.invoiceNumber}.pdf`);
    doc.text(`Factura N°: ${factura.invoiceNumber}`);
    doc.text(`Fecha: ${factura.date.toLocaleDateString()}`);
    doc.text(`Cliente: ${factura.client}`);
    doc.text('Items:');
    factura.items.forEach(item => {
      doc.text(`- ${item.descripcion} x${item.cantidad} - $${item.precio}`);
    });
    doc.text(`Total: $${factura.total}`);
    doc.text(`Estado: ${factura.status}`);
    if (factura.notes) doc.text(`Notas: ${factura.notes}`);
    doc.end();
    doc.pipe(res);
  } catch (err) {
    next(err);
  }
};

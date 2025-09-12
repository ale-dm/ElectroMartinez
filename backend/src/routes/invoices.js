const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { authenticated, isAdmin } = require('../middlewares/auth');
const { body } = require('express-validator');

// Crear factura (admin)
router.post('/', [
  authenticated,
  isAdmin,
  body('invoiceNumber').notEmpty(),
  body('client').notEmpty(),
  body('items').isArray({ min: 1 }),
  body('total').isNumeric()
], facturaController.crearFactura);
// Listar facturas (admin)
router.get('/', authenticated, isAdmin, facturaController.listarFacturas);
// Ver factura por id (admin)
router.get('/:id', authenticated, isAdmin, facturaController.detalleFactura);
// Eliminar factura (admin)
router.delete('/:id', authenticated, isAdmin, facturaController.eliminarFactura);
// Descargar factura en PDF (admin)
router.get('/:id/pdf', authenticated, isAdmin, facturaController.descargarPDF);

module.exports = router;

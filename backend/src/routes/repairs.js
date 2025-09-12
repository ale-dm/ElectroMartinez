const express = require('express');
const router = express.Router();
const reparacionController = require('../controllers/reparacionController');
const { authenticated, isAdmin } = require('../middlewares/auth');
const { body } = require('express-validator');

// Crear solicitud de reparación (usuario autenticado)
router.post('/', [
  authenticated,
  body('productoId').notEmpty(),
  body('descripcion').notEmpty()
], reparacionController.crearReparacion);
// Listar reparaciones (usuario: propias, admin: todas)
router.get('/', authenticated, reparacionController.listarReparaciones);
// Detalle de reparación
router.get('/:id', authenticated, reparacionController.detalleReparacion);
// Actualizar estado/notas (solo admin)
router.put('/:id', [
  authenticated,
  isAdmin,
  body('estado').optional().isIn(['pendiente', 'en curso', 'finalizada']),
  body('notas').optional().isString()
], reparacionController.actualizarReparacion);
// Eliminar reparación (solo admin)
router.delete('/:id', authenticated, isAdmin, reparacionController.eliminarReparacion);

module.exports = router;

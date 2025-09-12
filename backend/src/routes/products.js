const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { authenticated, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { body } = require('express-validator');

// Listar productos (público)
router.get('/', productoController.listarProductos);
// Detalle de producto
router.get('/:id', productoController.detalleProducto);
// Crear producto (admin)
router.post('/', [
  authenticated,
  isAdmin,
  body('nombre').notEmpty(),
  body('descripcion').notEmpty(),
  body('categoria').notEmpty(),
  body('precio').isNumeric(),
  body('marca').optional().isMongoId(),
  body('subcategoria').optional().isString()
], productoController.crearProducto);
// Editar producto (admin)
router.put('/:id', [
  authenticated,
  isAdmin,
  body('nombre').optional().notEmpty(),
  body('descripcion').optional().notEmpty(),
  body('categoria').optional().notEmpty(),
  body('precio').optional().isNumeric(),
  body('marca').optional().isMongoId(),
  body('subcategoria').optional().isString()
], productoController.editarProducto);
// Eliminar producto (admin)
router.delete('/:id', authenticated, isAdmin, productoController.eliminarProducto);
// Subir imagen (admin)
router.post('/:id/images', authenticated, isAdmin, upload.single('imagen'), productoController.subirImagen);

module.exports = router;

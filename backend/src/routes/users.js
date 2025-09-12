const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authenticated, isAdmin } = require('../middlewares/auth');
const { body } = require('express-validator');

// Listar usuarios (solo admin)
router.get('/', authenticated, isAdmin, usuarioController.listarUsuarios);
// Crear usuario (solo admin)
router.post('/', [
  authenticated,
  isAdmin,
  body('nombre').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], usuarioController.crearUsuario);
// Editar usuario (solo admin)
router.put('/:id', [
  authenticated,
  isAdmin,
  body('nombre').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 })
], usuarioController.editarUsuario);
// Eliminar usuario (solo admin)
router.delete('/:id', authenticated, isAdmin, usuarioController.eliminarUsuario);

module.exports = router;

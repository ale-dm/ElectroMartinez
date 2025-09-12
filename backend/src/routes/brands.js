const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

// Crear marca
router.post('/', marcaController.crearMarca);
// Obtener todas las marcas
router.get('/', marcaController.obtenerMarcas);
// Obtener una marca por ID
router.get('/:id', marcaController.obtenerMarcaPorId);
// Actualizar marca
router.put('/:id', marcaController.actualizarMarca);
// Eliminar marca
router.delete('/:id', marcaController.eliminarMarca);

module.exports = router;

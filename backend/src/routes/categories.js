const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// CRUD categorías
router.post('/', categoriaController.createCategoria);
router.get('/', categoriaController.getCategorias);

// Subcategorías
router.put('/:id', categoriaController.updateCategoria);
router.post('/:id/subcategorias', categoriaController.addSubcategoria);
router.delete('/:id/subcategorias', categoriaController.deleteSubcategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;

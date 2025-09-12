const Producto = require('../models/Producto');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.listarProductos = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      nombre,
      categoria,
      categorias,
      subcategoria,
      marca,
      marcas,
      activo,
      precioMin,
      precioMax,
      stockMin,
      stockMax,
      sort
    } = req.query;
    page = Number(page);
    limit = Number(limit);
    const query = {};
    if (nombre) query.nombre = { $regex: nombre, $options: 'i' };
    if (categoria) query.categoria = categoria;
    if (categorias) {
      // categorias=cat1,cat2
      const arr = Array.isArray(categorias) ? categorias : categorias.split(',');
      query.categoria = { $in: arr };
    }
    if (subcategoria) query.subcategoria = { $regex: subcategoria, $options: 'i' };
    if (marca) query.marca = marca;
    if (marcas) {
      // marcas=marca1,marca2
      const arr = Array.isArray(marcas) ? marcas : marcas.split(',');
      query.marca = { $in: arr };
    }
    if (activo !== undefined) query.activo = activo === 'true';
    if (precioMin !== undefined || precioMax !== undefined) {
      query.precio = {};
      if (precioMin !== undefined) query.precio.$gte = Number(precioMin);
      if (precioMax !== undefined) query.precio.$lte = Number(precioMax);
    }
    if (stockMin !== undefined || stockMax !== undefined) {
      query.stock = {};
      if (stockMin !== undefined) query.stock.$gte = Number(stockMin);
      if (stockMax !== undefined) query.stock.$lte = Number(stockMax);
    }
    // Ordenación
    let sortObj = {};
    if (sort) {
      // sort=precio,-nombre
      const fields = sort.split(',');
      for (const f of fields) {
        if (f.startsWith('-')) sortObj[f.substring(1)] = -1;
        else sortObj[f] = 1;
      }
    } else {
      sortObj = { nombre: 1 };
    }
    const total = await Producto.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const productos = await Producto.find(query)
      .populate('categoria', 'nombre')
      .populate('marca', 'nombre')
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({
      productos,
      meta: {
        total,
        totalPages,
        page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.detalleProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria', 'nombre')
      .populate('marca', 'nombre');
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(producto);
  } catch (err) {
    next(err);
  }
};

exports.crearProducto = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const { nombre, descripcion, categoria, subcategoria, marca, precio, stock, imagenes, activo } = req.body;
    const producto = new Producto({
      nombre: nombre && nombre.trim(),
      descripcion,
      categoria,
      subcategoria: subcategoria && subcategoria.trim(),
      marca,
      precio,
      stock,
      imagenes,
      activo
    });
    await producto.save();
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
};

exports.editarProducto = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Datos inválidos');
    error.status = 400;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const update = req.body;
    if (update.nombre) update.nombre = update.nombre.trim();
    if (update.subcategoria) update.subcategoria = update.subcategoria.trim();
    const producto = await Producto.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate('categoria', 'nombre')
      .populate('marca', 'nombre');
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(producto);
  } catch (err) {
    next(err);
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json({ msg: 'Producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};

exports.subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      const error = new Error('No se subió ninguna imagen');
      error.status = 400;
      return next(error);
    }
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'productos' });
    fs.unlinkSync(req.file.path);
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { $push: { imagenes: result.secure_url } },
      { new: true }
    );
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json({ msg: 'Imagen subida', url: result.secure_url, producto });
  } catch (err) {
    next(err);
  }
};

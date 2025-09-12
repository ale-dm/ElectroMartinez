const jwt = require('jsonwebtoken');

// Verifica que el usuario esté autenticado
exports.authenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, autorización denegada' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token no válido' });
  }
};

// Verifica que el usuario sea admin
exports.isAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ msg: 'Acceso solo para administradores' });
};

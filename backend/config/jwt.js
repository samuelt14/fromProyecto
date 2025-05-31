const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.generarToken = (usuario) => {
  return jwt.sign({ id: usuario.id_usuario, correo: usuario.correo }, JWT_SECRET, { expiresIn: '1h' });
};

exports.verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const jwt = require('jsonwebtoken');
const config = require('../../config');
const db = require('../../db');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const [rows] = await db.execute('SELECT id, email, role FROM users WHERE id = ?', [decoded.id]);
    
    if (!rows.length) {
      return res.status(401).json({ msg: 'Token inválido. Usuario no encontrado.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido o expirado.' });
  }
};
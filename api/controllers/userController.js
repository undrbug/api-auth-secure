const db = require('../../db');

exports.me = async (req, res) => {
  const [rows] = await db.execute('SELECT id, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!rows.length) {
    return res.status(404).json({ msg: 'Usuario no encontrado.' });
  }
  res.json(rows[0]);
};

exports.adminOnly = async (req, res) => {
  res.json({ msg: `Hola Admin ${req.user.email}, tu acceso está autorizado.` });
};
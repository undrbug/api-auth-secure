const db = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../../config');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );
    res.status(201).json({ msg: 'Usuario creado exitosamente.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: 'El email ya se encuentra registrado.' });
    }
    throw err;
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user) return res.status(401).json({ msg: 'Credenciales inválidas.' });

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return res.status(403).json({ msg: 'Cuenta bloqueada. Intente más tarde.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const attempts = user.login_attempts + 1;
    const lockedUntil = attempts >= config.security.maxAttempts 
      ? new Date(Date.now() + config.security.lockTime * 60 * 1000) 
      : null;
    await db.execute('UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?', [attempts, lockedUntil, user.id]);
    return res.status(401).json({ msg: 'Credenciales inválidas.' });
  }

  await db.execute('UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?', [user.id]);

  const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwt.secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, { expiresIn: '7d' });

  await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
};

exports.refreshToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) return res.status(401).json({ msg: 'Refresh token no encontrado.' });

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, config.jwt.refreshSecret);
  } catch (err) {
    return res.status(403).json({ msg: 'Token inválido o expirado.' });
  }
  
  const [rows] = await db.execute('SELECT id, role, refresh_token FROM users WHERE id = ?', [decoded.id]);
  const user = rows[0];

  if (!user || user.refresh_token !== oldRefreshToken) {
    if(user) await db.execute('UPDATE users SET refresh_token = NULL WHERE id = ?', [user.id]);
    return res.status(403).json({ msg: 'Token inválido o reutilizado. Se requiere nuevo login.' });
  }

  const newAccessToken = jwt.sign({ id: user.id, role: user.role }, config.jwt.secret, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, { expiresIn: '7d' });

  await db.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken: newAccessToken });
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(204).send();

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    await db.execute('UPDATE users SET refresh_token = NULL WHERE id = ?', [decoded.id]);
  } catch (err) {
    // No hacer nada, porque el token ya es inválido.
  }

  res.clearCookie('refreshToken');
  res.json({ msg: 'Sesión cerrada correctamente.' });
};
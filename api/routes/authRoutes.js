const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio.').trim().escape(),
    body('email').isEmail().withMessage('Debe ser un email válido.').normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
      .matches(/\d/).withMessage('La contraseña debe contener al menos un número.')
      .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula.')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula.')
      .matches(/[\W_]/).withMessage('La contraseña debe contener al menos un símbolo.') // \W es "no-word character"
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
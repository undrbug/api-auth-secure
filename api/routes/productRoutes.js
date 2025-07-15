const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const productController = require('../controllers/productController.js');

router.get('/', productController.getAllProducts);
router.get('/deals', productController.getDeals);
// router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, roleMiddleware('admin'), [
  body('title').notEmpty().withMessage('El título es obligatorio.'),
  body('description').notEmpty().withMessage('La descripción es obligatoria.'),
  body('price').isNumeric().withMessage('El precio debe ser un número.'),
  body('image').isString().withMessage('La imagen debe ser un texto.'), // Permite cualquier string
  body('category').notEmpty().withMessage('La categoría es obligatoria.'),
  body('stock').isNumeric().withMessage('El stock debe ser un número.'),
  body('on_offer').isBoolean().withMessage('El campo "en oferta" debe ser verdadero o falso.'),
  // Si no está en oferta, offer_price puede ser vacío o null
  body('offer_price').custom((value, { req }) => {
    if (req.body.on_offer) {
      if (value === undefined || value === null || value === '') {
        throw new Error('El precio de oferta es obligatorio si el producto está en oferta.');
      }
      if (isNaN(value)) {
        throw new Error('El precio de oferta debe ser un número.');
      }
    }
    return true;
  }),
  body('rating').optional().isNumeric().withMessage('El rating debe ser un número.'),
  body('rating_count').optional().isNumeric().withMessage('El conteo de rating debe ser un número.')
], productController.createProduct);

router.put('/:id', authMiddleware, roleMiddleware('admin'), [
  body('title').notEmpty().withMessage('El título es obligatorio.'),
  body('description').notEmpty().withMessage('La descripción es obligatoria.'),
  body('price').isNumeric().withMessage('El precio debe ser un número.'),
  body('image').isString().withMessage('La imagen debe ser un texto.'), // Permite cualquier string
  body('category').notEmpty().withMessage('La categoría es obligatoria.'),
  body('stock').isNumeric().withMessage('El stock debe ser un número.'),
  body('on_offer').isBoolean().withMessage('El campo "en oferta" debe ser verdadero o falso.'),
  body('offer_price').custom((value, { req }) => {
    if (req.body.on_offer) {
      if (value === undefined || value === null || value === '') {
        throw new Error('El precio de oferta es obligatorio si el producto está en oferta.');
      }
      if (isNaN(value)) {
        throw new Error('El precio de oferta debe ser un número.');
      }
    }
    return true;
  }),
  body('rating').optional().isNumeric().withMessage('El rating debe ser un número.'),
  body('rating_count').optional().isNumeric().withMessage('El conteo de rating debe ser un número.')
], productController.updateProduct);

router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

router.use(authMiddleware);

router.get('/me', userController.me);
router.get('/admin-only', roleMiddleware('admin'), userController.adminOnly);

module.exports = router;
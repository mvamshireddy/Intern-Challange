const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const router = express.Router();


router.get('/', authenticate, authorize('admin'), userController.listUsers);
router.get('/:id', authenticate, userController.getUserById);
router.post('/', authenticate, authorize('admin'), userController.createUser);
router.put('/password', authenticate, userController.updatePassword);

module.exports = router;
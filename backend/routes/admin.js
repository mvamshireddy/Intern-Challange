const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Dashboard stats (admin only)
router.get('/dashboard', authenticate, authorize('admin'), adminController.dashboard);

// List users with filters (admin only)
router.get('/users', authenticate, authorize('admin'), adminController.listUsers);

// List stores with ratings (admin only)
router.get('/stores', authenticate, authorize('admin'), adminController.listStores);

module.exports = router;
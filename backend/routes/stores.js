const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const storeController = require('../controllers/storeController');
const router = express.Router();

// List all stores (any authenticated user)
router.get('/', authenticate, storeController.listStores);

// Create a store (admin only)
router.post('/', authenticate, authorize('admin'), storeController.createStore);

// Store owner's dashboard
router.get('/owner/dashboard', authenticate, authorize('owner'), storeController.ownerDashboard);

module.exports = router;
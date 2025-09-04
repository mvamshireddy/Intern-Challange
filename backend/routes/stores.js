// backend/routes/stores.js

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');

// ✅ Import the new ownerDashboard function
const { listStores, createStore, ownerDashboard } = require('../controllers/storeController');

// ... (keep your existing GET '/' and POST '/' routes) ...

// GET /api/stores/owner/dashboard
// Fetches dashboard data. Accessible only by authenticated store owners.
router.get('/owner/dashboard', authenticate, authorize('owner'), ownerDashboard);

module.exports = router;
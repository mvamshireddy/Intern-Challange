const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const ratingController = require('../controllers/ratingController');
const router = express.Router();

// Submit or update a rating (normal user only)
router.post('/', authenticate, authorize('user'), ratingController.submitOrUpdateRating);

// Get a user's rating for a specific store
router.get('/:storeId', authenticate, ratingController.getUserRatingForStore);

module.exports = router;
const Rating = require('../models/Rating');
const Store = require('../models/Store');

// Submit or update a rating for a store (Normal User)
exports.submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId, value } = req.body;
    if (!storeId || ![1,2,3,4,5].includes(Number(value))) return res.status(400).json({ error: 'Invalid input' });

    // Upsert logic
    const [rating, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { value }
    });

    if (!created) {
      rating.value = value;
      await rating.save();
    }

    res.json({ message: created ? 'Rating submitted' : 'Rating updated', rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's rating for a store
exports.getUserRatingForStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const rating = await Rating.findOne({ where: { userId: req.user.id, storeId } });
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
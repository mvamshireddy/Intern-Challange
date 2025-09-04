// backend/controllers/storeController.js

// ... (keep your existing listStores and createStore functions) ...

/**
 * Fetches dashboard data for a logged-in store owner.
 * Returns their store's details, average rating, and a list of users who rated it.
 */
exports.ownerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id; // Get owner's ID from authenticated token

    // Find the store owned by this user
    const store = await Store.findOne({
      where: { ownerId },
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('Ratings.value')), 'averageRating']
        ]
      },
      include: [{ model: Rating, attributes: [] }],
      group: ['Store.id']
    });

    if (!store) {
      return res.status(404).json({ error: "No store found for this owner." });
    }

    // Find all ratings for this store and include the user who made the rating
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{
        model: User,
        attributes: ['name', 'email'] // Get the name and email of the rater
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      storeDetails: store,
      ratings
    });

  } catch (err) {
    console.error("ERROR in ownerDashboard:", err);
    res.status(500).json({ error: "Failed to fetch owner dashboard data." });
  }
};
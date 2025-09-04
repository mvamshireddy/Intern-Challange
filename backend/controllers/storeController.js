const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { Op } = require('sequelize');

// List stores with filtering, sorting, and average rating
exports.listStores = async (req, res) => {
  try {
    const { name, address, sort = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    // Fetch stores and include average rating
    const stores = await Store.findAll({
      where,
      order: [[sort, order]],
      include: [{
        model: Rating,
        attributes: []
      }]
    });

    // Map stores to include average rating
    const storesWithRating = await Promise.all(stores.map(async store => {
      const avgRating = await Rating.findOne({
        where: { storeId: store.id },
        attributes: [[Store.sequelize.fn('AVG', Store.sequelize.col('value')), 'avg']]
      });
      return {
        ...store.toJSON(),
        averageRating: avgRating ? Number(avgRating.get('avg')).toFixed(2) : null
      };
    }));

    res.json(storesWithRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create store (Admin only)
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name || !email || !address) return res.status(400).json({ error: 'Missing required fields' });
    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Store Owner Dashboard (see users who rated + average)
exports.ownerDashboard = async (req, res) => {
  try {
    // Find the store owned by this user
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    // Average rating
    const avg = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[Store.sequelize.fn('AVG', Store.sequelize.col('value')), 'avg']]
    });

    // List of users who rated
    const ratings = await Rating.findAll({ where: { storeId: store.id }, include: [{ model: User, attributes: ['name', 'email'] }] });

    res.json({
      store: store.name,
      averageRating: avg ? Number(avg.get('avg')).toFixed(2) : null,
      ratings: ratings.map(r => ({
        user: r.User ? r.User.name : null,
        email: r.User ? r.User.email : null,
        value: r.value
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { Op } = require('sequelize');

// Admin Dashboard: totals
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all users (with filters)
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sort = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sort, order]],
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all stores with ratings
exports.listStores = async (req, res) => {
  try {
    const { name, address, sort = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sort, order]],
      include: [{ model: Rating, attributes: [] }]
    });

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
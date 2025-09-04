const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Store = require('./Store');

const Rating = sequelize.define('Rating', {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
});

Rating.belongsTo(User, { foreignKey: 'userId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

module.exports = Rating;
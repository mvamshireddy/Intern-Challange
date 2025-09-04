const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null if not assigned
  }
});

Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Store;
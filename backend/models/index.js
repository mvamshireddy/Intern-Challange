const { sequelize } = require('../config/db'); // Adjust path if your db config is elsewhere
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// --- Define Model Associations ---
// This is the most important part. It tells Sequelize how the tables are related.

// A User can submit many Ratings.
User.hasMany(Rating, {
  foreignKey: 'userId',
  onDelete: 'CASCADE' // If a user is deleted, their ratings are also deleted.
});
// Each Rating belongs to exactly one User.
Rating.belongsTo(User, {
  foreignKey: 'userId'
});

// A Store can receive many Ratings.
Store.hasMany(Rating, {
  foreignKey: 'storeId',
  onDelete: 'CASCADE' // If a store is deleted, its ratings are also deleted.
});
// Each Rating belongs to exactly one Store.
Rating.belongsTo(Store, {
  foreignKey: 'storeId'
});

// A Store is owned by a User (for the 'Store Owner' role).
// This assumes you have an 'ownerId' column in your 'stores' table.
User.hasMany(Store, {
  foreignKey: 'ownerId',
  as: 'ownedStores'
});
Store.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

// --- Sync and Export ---
// It's good practice to sync your database schema here, especially in development.
// In a production app, you would use migration files instead of `force: false`.
sequelize.sync({ alter: true }) // Use `alter: true` to update tables, or `force: false` to just create if not exist
  .then(() => {
    console.log('Database & tables have been synchronized.');
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err);
  });

// Export all models from this file so you can import them easily elsewhere
module.exports = {
  User,
  Store,
  Rating
};
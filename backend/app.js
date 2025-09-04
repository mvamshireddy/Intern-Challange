const express = require('express');
const cors = require('cors');
const dotenv =require('dotenv');
dotenv.config();


const { sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack); // Log the full error to the terminal
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

module.exports = app;
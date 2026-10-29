require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./db');
const foodsRouter = require('./routes/foods');

const app = express();
const port = Number(process.env.PORT) || 5000;
const configuredOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true;

app.use(cors({ origin: configuredOrigins }));
app.use(express.json());

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.json({
      status: 'UP',
      database: 'connected',
      uptime: process.uptime(),
    });
  }
  return res.status(503).json({ status: 'DOWN', database: 'disconnected' });
});

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database is not connected' });
  }
  return next();
});
app.use('/api/foods', foodsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(error.errors).map((item) => item.message),
    });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid value', details: [error.message] });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: 'foodId already exists' });
  }
  if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
    return res.status(503).json({ error: 'Database connection unavailable' });
  }
  console.error('Unhandled error:', error);
  return res.status(500).json({ error: 'Internal server error' });
});

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection failed:', error.message));

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

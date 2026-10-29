const express = require('express');
const mongoose = require('mongoose');
const Food = require('../models/Food');
const { buildSearchRegex } = require('../utils/searchRegex');

const router = express.Router();
const FOOD_FIELDS = [
  'foodId',
  'name',
  'category',
  'cuisine',
  'ingredients',
  'price',
  'quantity',
  'description',
  'imageUrl',
];

function pickFoodFields(body) {
  return Object.fromEntries(
    FOOD_FIELDS.filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function validateId(id) {
  return mongoose.isValidObjectId(id);
}

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const regex = buildSearchRegex(req.query.search);
      filter.$or = [{ name: regex }, { category: regex }, { cuisine: regex }];
    }
    const foods = await Food.find(filter).sort({ foodId: 1 });
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!validateId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid food id' });
  }
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    return res.json(food);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = pickFoodFields(req.body);
    if (data.foodId && await Food.exists({ foodId: data.foodId })) {
      return res.status(409).json({ error: 'foodId already exists' });
    }
    const food = await Food.create(data);
    return res.status(201).json(food);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!validateId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid food id' });
  }
  try {
    const data = pickFoodFields(req.body);
    if (data.foodId && await Food.exists({ foodId: data.foodId, _id: { $ne: req.params.id } })) {
      return res.status(409).json({ error: 'foodId already exists' });
    }
    const food = await Food.findByIdAndUpdate(req.params.id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    return res.json(food);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!validateId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid food id' });
  }
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    return res.json({ message: 'Food deleted', _id: food._id });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

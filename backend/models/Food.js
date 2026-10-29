const mongoose = require('mongoose');

const nonEmptyString = {
  type: String,
  trim: true,
  validate: {
    validator: (value) => value.length > 0,
    message: 'Ingredient values must not be empty',
  },
};

const foodSchema = new mongoose.Schema(
  {
    foodId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    ingredients: {
      type: [nonEmptyString],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 1,
        message: 'At least one ingredient is required',
      },
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, validate: Number.isInteger },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
  },
  { collection: 'foods', timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);

const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  bio: { type: String },
  imageUrl: { type: String },
  basePrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);

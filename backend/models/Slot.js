const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:mm
  isBooked: { type: Boolean, default: false }
}, { timestamps: true });

// Prevent duplicate slots for the same expert at the same time
slotSchema.index({ expertId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
  },
  capacity: {
    type: Number,
    min: 1,
    default: 30,
  },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  availableFrom: {
    type: Number,
    min: 6,
    max: 20,
    default: 8,
  },
  availableTo: {
    type: Number,
    min: 6,
    max: 20,
    default: 18,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);

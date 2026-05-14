const mongoose = require('mongoose');

const constraintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  maxHoursPerDay: {
    type: Number,
    min: 1,
    max: 10,
    default: 6,
  },
  lunchBreakStart: {
    type: Number,
    min: 11,
    max: 14,
    default: 12,
  },
  lunchBreakEnd: {
    type: Number,
    min: 12,
    max: 15,
    default: 13,
  },
  breakBetweenClasses: {
    type: Number,
    min: 0,
    max: 2,
    default: 0,
    comment: 'Break duration in slots between consecutive classes',
  },
  blockedSlots: {
    type: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      hour: { type: Number, min: 8, max: 17 },
    }],
    default: [],
  },
  activeDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  dayStartHour: {
    type: Number,
    min: 6,
    max: 12,
    default: 8,
  },
  dayEndHour: {
    type: Number,
    min: 14,
    max: 20,
    default: 18,
  },
}, { timestamps: true });

module.exports = mongoose.model('Constraint', constraintSchema);

const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  instruments: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'At least two instruments are required'],
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom validator for instruments
function arrayLimit(val) {
  return val.length >= 2;
}

module.exports = mongoose.model('Registration', registrationSchema);

const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: String,
  subscribedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);

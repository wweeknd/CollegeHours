const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: String },
  details: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Placement', PlacementSchema);

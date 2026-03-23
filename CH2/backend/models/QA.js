const mongoose = require('mongoose');

const QASchema = new mongoose.Schema({
  subject: { type: String, required: true },
  question: { type: String, required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  answers: [{
    body: String,
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answeredAt: { type: Date, default: Date.now }
  }],
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QA', QASchema);

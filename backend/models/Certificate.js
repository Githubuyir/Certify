const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  organization: { type: String },
  courseDomain: { type: String, required: true },
  issueDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, default: 'valid', enum: ['valid', 'revoked', 'pending'] }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);

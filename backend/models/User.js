const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  verificationsCount: { type: Number, default: 0 },
  downloadsCount: { type: Number, default: 0 },
  institutionName: { type: String },
  companyWebsite: { type: String },
  linkedinId: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Composite index to allow the same email to be used for different roles
userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);

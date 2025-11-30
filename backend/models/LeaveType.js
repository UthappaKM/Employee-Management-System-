const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  annualQuota: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  isPaid: {
    type: Boolean,
    default: true
  },
  requiresDocumentation: {
    type: Boolean,
    default: false
  },
  maxConsecutiveDays: {
    type: Number,
    default: null // null means no limit
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#3498db'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeaveType', leaveTypeSchema);

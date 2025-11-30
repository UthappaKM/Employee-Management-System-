const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  totalQuota: {
    type: Number,
    required: true,
    min: 0
  },
  used: {
    type: Number,
    default: 0,
    min: 0
  },
  pending: {
    type: Number,
    default: 0,
    min: 0
  },
  carriedForward: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Create compound index for employee, leaveType and year
leaveBalanceSchema.index({ employee: 1, leaveType: 1, year: 1 }, { unique: true });

// Virtual for available balance
leaveBalanceSchema.virtual('available').get(function() {
  return this.totalQuota + this.carriedForward - this.used - this.pending;
});

// Ensure virtuals are included in JSON
leaveBalanceSchema.set('toJSON', { virtuals: true });
leaveBalanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);

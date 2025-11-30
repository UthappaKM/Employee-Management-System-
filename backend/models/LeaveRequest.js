const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isHalfDay: {
    type: Boolean,
    default: false
  },
  halfDaySession: {
    type: String,
    enum: ['morning', 'afternoon', null],
    default: null
  },
  totalDays: {
    type: Number,
    required: true,
    min: 0.5
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvalChain: [{
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['manager', 'hr', 'admin']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    comments: String,
    actionDate: Date
  }],
  currentApprover: {
    type: String,
    enum: ['manager', 'hr', 'admin', null],
    default: 'manager'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  attendanceCreated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
leaveRequestSchema.index({ employee: 1, startDate: -1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ currentApprover: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);

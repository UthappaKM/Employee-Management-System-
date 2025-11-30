const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date,
    default: null
  },
  checkOut: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Half Day', 'Leave'],
    default: 'Absent'
  },
  isLeave: {
    type: Boolean,
    default: false
  },
  leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    default: null
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
  workHours: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Calculate work hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const hours = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.workHours = Math.round(hours * 100) / 100; // Round to 2 decimal places
    
    // Auto-update status based on work hours
    if (hours >= 8) {
      this.status = 'Present';
    } else if (hours >= 4) {
      this.status = 'Half Day';
    } else if (hours > 0) {
      this.status = 'Late';
    }
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);

const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  workingDays: {
    type: Number,
    required: true,
    default: 0
  },
  presentDays: {
    type: Number,
    required: true,
    default: 0
  },
  absentDays: {
    type: Number,
    default: 0
  },
  leaveDays: {
    type: Number,
    default: 0
  },
  halfDays: {
    type: Number,
    default: 0
  },
  lateDays: {
    type: Number,
    default: 0
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: [{
    name: String,
    amount: Number
  }],
  deductions: [{
    name: String,
    amount: Number
  }],
  grossSalary: {
    type: Number,
    required: true,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Paid', 'Rejected'],
    default: 'Pending'
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paidDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cheque'],
    default: 'Bank Transfer'
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ month: 1, year: 1 });
payrollSchema.index({ status: 1 });

// Method to calculate pro-rated salary based on attendance
payrollSchema.methods.calculateSalary = function() {
  // Calculate total allowances
  const totalAllowances = this.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  
  // Calculate gross salary (basic + allowances)
  this.grossSalary = this.basicSalary + totalAllowances;
  
  // Calculate pro-rated salary based on attendance
  // Half day counts as 0.5, late day counts as full day
  const effectiveDays = this.presentDays + (this.halfDays * 0.5) + this.lateDays;
  const attendanceRatio = this.workingDays > 0 ? effectiveDays / this.workingDays : 0;
  const proratedGrossSalary = this.grossSalary * attendanceRatio;
  
  // Calculate total deductions
  const totalDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  
  // Calculate net salary
  this.netSalary = Math.max(0, proratedGrossSalary - totalDeductions);
  
  return this.netSalary;
};

module.exports = mongoose.model('Payroll', payrollSchema);

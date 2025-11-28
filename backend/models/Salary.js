const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  deductions: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMode: {
    type: String,
    enum: ['Bank Transfer', 'Cheque'],
    default: 'Bank Transfer'
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountHolderName: String
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Virtual for gross salary
salarySchema.virtual('grossSalary').get(function() {
  const totalAllowances = this.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  return this.basicSalary + totalAllowances;
});

// Virtual for total deductions
salarySchema.virtual('totalDeductions').get(function() {
  return this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
});

// Virtual for net salary
salarySchema.virtual('netSalary').get(function() {
  return this.grossSalary - this.totalDeductions;
});

// Ensure virtuals are included in JSON
salarySchema.set('toJSON', { virtuals: true });
salarySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Salary', salarySchema);

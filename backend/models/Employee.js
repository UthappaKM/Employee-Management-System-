const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please provide a position'],
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Please assign a department']
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  salary: {
    type: Number,
    min: 0
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave', 'terminated'],
    default: 'active'
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branch: String
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
employeeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate employee ID before saving
employeeSchema.pre('save', async function(next) {
  if (!this.employeeId && this.department) {
    try {
      // Get department to access its code
      const Department = mongoose.model('Department');
      const dept = await Department.findById(this.department);
      
      if (dept) {
        // Get department code (e.g., "ENG" for Engineering)
        const deptCode = dept.code || dept.name.substring(0, 3).toUpperCase();
        
        // Find the last employee in this department
        const lastEmployee = await this.constructor
          .findOne({ department: this.department })
          .sort({ employeeId: -1 })
          .select('employeeId');
        
        let nextNumber = 1;
        if (lastEmployee && lastEmployee.employeeId) {
          // Extract the number from the last employee ID (e.g., "ENG-005" -> 5)
          const match = lastEmployee.employeeId.match(/\d+$/);
          if (match) {
            nextNumber = parseInt(match[0]) + 1;
          }
        }
        
        // Generate new employee ID (e.g., "ENG-001", "ENG-002")
        this.employeeId = `${deptCode}-${String(nextNumber).padStart(3, '0')}`;
      } else {
        // Fallback if department not found
        this.employeeId = `EMP-${String(Date.now()).slice(-6)}`;
      }
    } catch (error) {
      console.error('Error generating employee ID:', error);
      // Fallback to timestamp-based ID
      this.employeeId = `EMP-${String(Date.now()).slice(-6)}`;
    }
  }
  next();
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);

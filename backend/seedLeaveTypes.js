const mongoose = require('mongoose');
const LeaveType = require('./models/LeaveType');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const defaultLeaveTypes = [
  {
    name: 'Casual Leave',
    code: 'CL',
    annualQuota: 12,
    isPaid: true,
    requiresDocumentation: false,
    maxConsecutiveDays: 0,
    color: '#28a745',
    isActive: true
  },
  {
    name: 'Sick Leave',
    code: 'SL',
    annualQuota: 12,
    isPaid: true,
    requiresDocumentation: true,
    maxConsecutiveDays: 0,
    color: '#dc3545',
    isActive: true
  },
  {
    name: 'Earned Leave',
    code: 'EL',
    annualQuota: 15,
    isPaid: true,
    requiresDocumentation: false,
    maxConsecutiveDays: 0,
    color: '#007bff',
    isActive: true
  },
  {
    name: 'Privilege Leave',
    code: 'PL',
    annualQuota: 10,
    isPaid: true,
    requiresDocumentation: false,
    maxConsecutiveDays: 0,
    color: '#ffc107',
    isActive: true
  },
  {
    name: 'Maternity Leave',
    code: 'ML',
    annualQuota: 180,
    isPaid: true,
    requiresDocumentation: true,
    maxConsecutiveDays: 0,
    color: '#e83e8c',
    isActive: true
  },
  {
    name: 'Paternity Leave',
    code: 'PTL',
    annualQuota: 15,
    isPaid: true,
    requiresDocumentation: true,
    maxConsecutiveDays: 15,
    color: '#17a2b8',
    isActive: true
  },
  {
    name: 'Compensatory Off',
    code: 'CO',
    annualQuota: 0,
    isPaid: true,
    requiresDocumentation: false,
    maxConsecutiveDays: 0,
    color: '#6610f2',
    isActive: true
  },
  {
    name: 'Loss of Pay',
    code: 'LOP',
    annualQuota: 0,
    isPaid: false,
    requiresDocumentation: false,
    maxConsecutiveDays: 0,
    color: '#6c757d',
    isActive: true
  }
];

async function seedLeaveTypes() {
  try {
    // Clear existing leave types (optional - comment out if you want to keep existing)
    // await LeaveType.deleteMany({});
    // console.log('Cleared existing leave types');

    // Check if leave types already exist
    const existingCount = await LeaveType.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing leave types. Skipping seed.`);
      console.log('Delete existing leave types manually if you want to reseed.');
      process.exit(0);
    }

    // Insert default leave types
    const result = await LeaveType.insertMany(defaultLeaveTypes);
    console.log(`✅ Successfully created ${result.length} leave types:`);
    result.forEach(type => {
      console.log(`   - ${type.name} (${type.code}) - ${type.annualQuota} days`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding leave types:', error);
    process.exit(1);
  }
}

seedLeaveTypes();

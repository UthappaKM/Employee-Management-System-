// Script to update user role from employee to manager
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateUserRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Change this email to the manager's email
    const email = 'manager1@emp.com';
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      process.exit(1);
    }

    console.log('Current user:', {
      name: user.name,
      email: user.email,
      role: user.role
    });

    user.role = 'manager';
    await user.save();

    console.log('✅ User role updated to: manager');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateUserRole();

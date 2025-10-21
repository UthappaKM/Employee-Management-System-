const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { protect, hrOrAdmin } = require('../middleware/auth');

// @route   POST /api/employees/create-with-user
// @desc    Create employee with user account (Admin/HR only)
// @access  Private (Admin/HR)
router.post('/create-with-user', [
  protect,
  hrOrAdmin,
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('temporaryPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('userRole').isIn(['hr', 'manager', 'employee']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { temporaryPassword, userRole, createUserAccount, ...employeeData } = req.body;

    // Check if email already exists (in users or employees)
    const existingUser = await User.findOne({ email: employeeData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

    const existingEmployee = await Employee.findOne({ email: employeeData.email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    // Create employee record first
    const employee = await Employee.create(employeeData);

    // Create user account if requested
    let user = null;
    if (createUserAccount !== false) {
      user = await User.create({
        name: `${employeeData.firstName} ${employeeData.lastName}`,
        email: employeeData.email,
        password: temporaryPassword,
        role: userRole || 'employee',
        employeeId: employee._id
      });

      // Update employee with user reference
      employee.userId = user._id;
      await employee.save();
    }

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name code')
      .populate('manager', 'firstName lastName');

    res.status(201).json({
      employee: populatedEmployee,
      user: user ? {
        id: user._id,
        email: user.email,
        role: user.role
      } : null,
      temporaryPassword: temporaryPassword // Send back to admin to give to employee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

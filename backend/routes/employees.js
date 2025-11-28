const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const { protect, adminOrManager, hrOrAdmin, hrManagerOrAdmin } = require('../middleware/auth');

// @route   GET /api/employees
// @desc    Get all employees (or filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, department, search } = req.query;
    let query = {};

    // Role-based filtering
    // Employee: See only their own record
    if (req.user.role === 'employee') {
      const employeeRecord = await Employee.findOne({ email: req.user.email })
        .populate('department', 'name code')
        .populate('manager', 'firstName lastName');
      
      if (employeeRecord) {
        return res.json([employeeRecord]);
      } else {
        return res.json([]);
      }
    }
    
    // Manager: See only their department
    if (req.user.role === 'manager') {
      const managerRecord = await Employee.findOne({ email: req.user.email });
      if (managerRecord && managerRecord.department) {
        query.department = managerRecord.department;
        console.log('Manager viewing department:', managerRecord.department);
      } else {
        console.log('Manager record not found or no department assigned for:', req.user.email);
        return res.json([]);
      }
    }

    // Admin & HR: See all employees (no additional filter)

    // Apply additional filters
    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query)
      .populate('department', 'name code')
      .populate('manager', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department')
      .populate('manager', 'firstName lastName email position');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (Admin/HR)
router.post('/', [
  protect,
  hrOrAdmin,
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: req.body.email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create(req.body);
    
    const populatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name code')
      .populate('manager', 'firstName lastName');

    res.status(201).json(populatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (Admin/HR can edit all, Manager can edit their dept only)
router.put('/:id', [
  protect,
  hrManagerOrAdmin
], async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Prevent users from editing their own employee record
    if (employee.email === req.user.email) {
      return res.status(403).json({ message: 'You cannot edit your own employee record.' });
    }

    // Manager can only edit employees in their department
    if (req.user.role === 'manager') {
      const managerRecord = await Employee.findOne({ email: req.user.email });
      if (!managerRecord || !employee.department.equals(managerRecord.department)) {
        return res.status(403).json({ message: 'Access denied. You can only edit employees in your department.' });
      }
    }

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email: req.body.email });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('department', 'name code')
      .populate('manager', 'firstName lastName');

    res.json(employee);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin/Manager)
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.deleteOne();

    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/employees/stats/overview
// @desc    Get employee statistics
// @access  Private (Admin/HR see all, Manager sees their dept)
router.get('/stats/overview', protect, hrManagerOrAdmin, async (req, res) => {
  try {
    let query = {};

    // Manager: Only their department stats
    if (req.user.role === 'manager') {
      const managerRecord = await Employee.findOne({ email: req.user.email });
      if (managerRecord && managerRecord.department) {
        query.department = managerRecord.department;
      } else {
        return res.json({
          totalEmployees: 0,
          activeEmployees: 0,
          inactiveEmployees: 0,
          onLeave: 0,
          departmentStats: []
        });
      }
    }

    // Admin & HR: All departments (no filter)

    const totalEmployees = await Employee.countDocuments(query);
    const activeEmployees = await Employee.countDocuments({ ...query, status: 'active' });
    const inactiveEmployees = await Employee.countDocuments({ ...query, status: 'inactive' });
    const onLeave = await Employee.countDocuments({ ...query, status: 'on-leave' });

    const departmentStats = await Employee.aggregate([
      ...(query.department ? [{ $match: query }] : []),
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: '$department'
      },
      {
        $project: {
          _id: 0,
          departmentName: '$department.name',
          count: 1
        }
      }
    ]);

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      onLeave,
      departmentStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const { protect, adminOrManager } = require('../middleware/auth');

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const departments = await Department.find(query)
      .populate('head', 'firstName lastName email')
      .sort({ name: 1 });

    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('head', 'firstName lastName email position');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Get employee count
    const employeeCount = await Employee.countDocuments({ department: req.params.id });

    res.json({
      ...department.toObject(),
      employeeCount
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/departments
// @desc    Create new department
// @access  Private (Admin/Manager)
router.post('/', [
  protect,
  adminOrManager,
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if department with same name or code exists
    const existingDept = await Department.findOne({
      $or: [
        { name: req.body.name },
        { code: req.body.code }
      ]
    });

    if (existingDept) {
      return res.status(400).json({ message: 'Department with this name or code already exists' });
    }

    // Filter out empty string values for optional fields
    const departmentData = { ...req.body };
    if (departmentData.head === '' || departmentData.head === null) {
      delete departmentData.head;
    }

    const department = await Department.create(departmentData);

    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'firstName lastName email');

    res.status(201).json(populatedDepartment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private (Admin/Manager)
router.put('/:id', protect, adminOrManager, async (req, res) => {
  try {
    let department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if name or code is being changed and if it's already taken
    if (req.body.name || req.body.code) {
      const existingDept = await Department.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { name: req.body.name },
          { code: req.body.code }
        ]
      });

      if (existingDept) {
        return res.status(400).json({ message: 'Department name or code already in use' });
      }
    }

    // Filter out empty string values for optional fields
    const updateData = { ...req.body };
    if (updateData.head === '' || updateData.head === null) {
      delete updateData.head;
    }

    department = await Department.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName email');

    res.json(department);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private (Admin/Manager)
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has employees
    const employeeCount = await Employee.countDocuments({ department: req.params.id });
    if (employeeCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete department. It has ${employeeCount} employee(s) assigned.` 
      });
    }

    await department.deleteOne();

    res.json({ message: 'Department removed successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

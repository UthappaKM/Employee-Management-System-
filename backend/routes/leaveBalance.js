const express = require('express');
const router = express.Router();
const LeaveBalance = require('../models/LeaveBalance');
const LeaveType = require('../models/LeaveType');
const Employee = require('../models/Employee');
const { protect, hrOrAdmin } = require('../middleware/auth');

// @route   GET /api/leave-balance/my-balance
// @desc    Get leave balance for logged-in employee
// @access  Private
router.get('/my-balance', protect, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    
    const currentYear = new Date().getFullYear();
    const balances = await LeaveBalance.find({ 
      employee: employee._id,
      year: currentYear
    }).populate('leaveType');
    
    res.json(balances);
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leave-balance/employee/:employeeId
// @desc    Get leave balance for specific employee
// @access  Private (HR/Admin)
router.get('/employee/:employeeId', protect, hrOrAdmin, async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const balances = await LeaveBalance.find({
      employee: req.params.employeeId,
      year: year
    }).populate('leaveType');
    
    res.json(balances);
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/leave-balance/initialize/:employeeId
// @desc    Initialize leave balance for employee
// @access  Private (HR/Admin)
router.post('/initialize/:employeeId', protect, hrOrAdmin, async (req, res) => {
  try {
    const { year } = req.body;
    const currentYear = year || new Date().getFullYear();
    
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const leaveTypes = await LeaveType.find({ isActive: true });
    const balances = [];
    
    for (const leaveType of leaveTypes) {
      // Check if balance already exists
      const existing = await LeaveBalance.findOne({
        employee: employee._id,
        leaveType: leaveType._id,
        year: currentYear
      });
      
      if (!existing) {
        const balance = await LeaveBalance.create({
          employee: employee._id,
          leaveType: leaveType._id,
          year: currentYear,
          totalQuota: leaveType.annualQuota,
          used: 0,
          pending: 0,
          carriedForward: 0
        });
        balances.push(balance);
      }
    }
    
    const allBalances = await LeaveBalance.find({
      employee: employee._id,
      year: currentYear
    }).populate('leaveType');
    
    res.json(allBalances);
  } catch (error) {
    console.error('Error initializing leave balance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave-balance/:id
// @desc    Update leave balance manually
// @access  Private (HR/Admin)
router.put('/:id', protect, hrOrAdmin, async (req, res) => {
  try {
    const { totalQuota, used, pending, carriedForward } = req.body;
    
    const balance = await LeaveBalance.findByIdAndUpdate(
      req.params.id,
      { totalQuota, used, pending, carriedForward },
      { new: true, runValidators: true }
    ).populate('leaveType');
    
    if (!balance) {
      return res.status(404).json({ message: 'Leave balance not found' });
    }
    
    res.json(balance);
  } catch (error) {
    console.error('Error updating leave balance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

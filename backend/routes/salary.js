const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const { protect, hr, admin } = require('../middleware/auth');

// Get all salary records (HR and Admin only)
router.get('/', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const salaries = await Salary.find({})
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department userId',
        populate: [
          { path: 'department', select: 'name' },
          { path: 'userId', select: 'email role' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(salaries);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get salary by employee ID
router.get('/employee/:employeeId', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    const requestedEmployeeId = req.params.employeeId;
    
    // Check if user is accessing their own salary or has HR/Admin privileges
    if (userRole === 'employee') {
      const myEmployee = await Employee.findOne({ userId: req.user._id });
      if (!myEmployee || myEmployee._id.toString() !== requestedEmployeeId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const salary = await Salary.findOne({ employee: requestedEmployeeId })
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get my salary (for logged-in employee)
router.get('/my-salary', protect, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const salary = await Salary.findOne({ employee: employee._id })
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create salary record (HR and Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { employee, basicSalary, allowances, deductions, effectiveDate, currency, paymentMode, bankDetails, notes } = req.body;

    // Check if employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if salary already exists for this employee
    const existingSalary = await Salary.findOne({ employee });
    if (existingSalary) {
      return res.status(400).json({ message: 'Salary record already exists for this employee. Use update instead.' });
    }

    const salary = new Salary({
      employee,
      basicSalary,
      allowances: allowances || [],
      deductions: deductions || [],
      effectiveDate: effectiveDate || Date.now(),
      currency: currency || 'USD',
      paymentMode: paymentMode || 'Bank Transfer',
      bankDetails: bankDetails || {},
      notes: notes || ''
    });

    await salary.save();

    const populatedSalary = await Salary.findById(salary._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      });

    res.status(201).json(populatedSalary);
  } catch (error) {
    console.error('Error creating salary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update salary record (HR and Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { basicSalary, allowances, deductions, effectiveDate, currency, paymentMode, bankDetails, notes } = req.body;

    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    if (basicSalary !== undefined) salary.basicSalary = basicSalary;
    if (allowances !== undefined) salary.allowances = allowances;
    if (deductions !== undefined) salary.deductions = deductions;
    if (effectiveDate !== undefined) salary.effectiveDate = effectiveDate;
    if (currency !== undefined) salary.currency = currency;
    if (paymentMode !== undefined) salary.paymentMode = paymentMode;
    if (bankDetails !== undefined) salary.bankDetails = bankDetails;
    if (notes !== undefined) salary.notes = notes;

    await salary.save();

    const populatedSalary = await Salary.findById(salary._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      });

    res.json(populatedSalary);
  } catch (error) {
    console.error('Error updating salary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete salary record (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    console.error('Error deleting salary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

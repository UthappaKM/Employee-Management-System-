const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { protect, hr, admin } = require('../middleware/auth');

// Get all payroll records with filters
router.get('/', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    const { month, year, status, employeeId } = req.query;
    const query = {};

    // Role-based access
    if (userRole === 'employee') {
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: 'Employee profile not found' });
      }
      query.employee = employee._id;
    } else if (userRole !== 'hr' && userRole !== 'admin' && userRole !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Apply filters
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (status) query.status = status;
    if (employeeId && (userRole === 'hr' || userRole === 'admin' || userRole === 'manager')) {
      query.employee = employeeId;
    }

    const payrolls = await Payroll.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      })
      .populate('generatedBy', 'username email')
      .populate('approvedBy', 'username email')
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.json(payrolls);
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payroll by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      })
      .populate('generatedBy', 'username email')
      .populate('approvedBy', 'username email');

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    // Check access
    const userRole = req.user.role;
    if (userRole === 'employee') {
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee || payroll.employee._id.toString() !== employee._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(payroll);
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate payroll for a month (HR and Admin only)
router.post('/generate', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { month, year, employeeIds } = req.body;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const generatedPayrolls = [];
    const errors = [];

    // Get employees to process
    let employees;
    if (employeeIds && employeeIds.length > 0) {
      employees = await Employee.find({ _id: { $in: employeeIds } });
    } else {
      employees = await Employee.find({});
    }

    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existingPayroll = await Payroll.findOne({
          employee: employee._id,
          month: parseInt(month),
          year: parseInt(year)
        });

        if (existingPayroll) {
          errors.push({ employee: employee._id, message: 'Payroll already exists' });
          continue;
        }

        // Get salary structure
        const salary = await Salary.findOne({ employee: employee._id });
        if (!salary) {
          errors.push({ employee: employee._id, message: 'No salary structure found' });
          continue;
        }

        // Get attendance for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        const attendanceRecords = await Attendance.find({
          employee: employee._id,
          date: { $gte: startDate, $lte: endDate }
        });

        // Calculate attendance stats
        const workingDays = endDate.getDate();
        let presentDays = 0;
        let absentDays = 0;
        let leaveDays = 0;
        let halfDays = 0;
        let lateDays = 0;

        attendanceRecords.forEach(record => {
          switch (record.status) {
            case 'Present':
              presentDays++;
              break;
            case 'Absent':
              absentDays++;
              break;
            case 'Leave':
              leaveDays++;
              break;
            case 'Half Day':
              halfDays++;
              break;
            case 'Late':
              lateDays++;
              break;
          }
        });

        // Create payroll record
        const payroll = new Payroll({
          employee: employee._id,
          month: parseInt(month),
          year: parseInt(year),
          workingDays,
          presentDays,
          absentDays,
          leaveDays,
          halfDays,
          lateDays,
          basicSalary: salary.basicSalary,
          allowances: salary.allowances,
          deductions: salary.deductions,
          generatedBy: req.user._id
        });

        // Calculate salary
        payroll.calculateSalary();
        await payroll.save();

        generatedPayrolls.push(payroll);
      } catch (err) {
        errors.push({ employee: employee._id, message: err.message });
      }
    }

    res.status(201).json({
      message: `Generated ${generatedPayrolls.length} payroll records`,
      generatedPayrolls,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update payroll status (Approve/Reject)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Paid'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    payroll.status = status;
    if (status === 'Approved' || status === 'Rejected') {
      payroll.approvedBy = req.user._id;
    }

    await payroll.save();

    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      })
      .populate('generatedBy', 'username email')
      .populate('approvedBy', 'username email');

    res.json(populatedPayroll);
  } catch (error) {
    console.error('Error updating payroll status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark payroll as paid
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { paymentMethod, transactionId, notes } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    if (payroll.status !== 'Approved') {
      return res.status(400).json({ message: 'Payroll must be approved before payment' });
    }

    payroll.status = 'Paid';
    payroll.paidDate = new Date();
    if (paymentMethod) payroll.paymentMethod = paymentMethod;
    if (transactionId) payroll.transactionId = transactionId;
    if (notes) payroll.notes = notes;

    await payroll.save();

    const populatedPayroll = await Payroll.findById(payroll._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: { path: 'department', select: 'name' }
      })
      .populate('generatedBy', 'username email')
      .populate('approvedBy', 'username email');

    res.json(populatedPayroll);
  } catch (error) {
    console.error('Error marking payroll as paid:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete payroll record (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    if (payroll.status === 'Paid') {
      return res.status(400).json({ message: 'Cannot delete paid payroll records' });
    }

    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    console.error('Error deleting payroll:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payroll summary/statistics
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'hr' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { month, year } = req.query;
    const query = {};

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await Payroll.find(query);

    const summary = {
      totalRecords: payrolls.length,
      pending: payrolls.filter(p => p.status === 'Pending').length,
      approved: payrolls.filter(p => p.status === 'Approved').length,
      paid: payrolls.filter(p => p.status === 'Paid').length,
      rejected: payrolls.filter(p => p.status === 'Rejected').length,
      totalGrossSalary: payrolls.reduce((sum, p) => sum + p.grossSalary, 0),
      totalNetSalary: payrolls.reduce((sum, p) => sum + p.netSalary, 0),
      totalPaid: payrolls.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.netSalary, 0)
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

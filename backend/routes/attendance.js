const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get employees based on user role (for attendance viewing)
router.get('/employees/viewable', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    let employees = [];

    if (userRole === 'employee') {
      // Employees can only see themselves
      const employee = await Employee.findOne({ userId: req.user._id })
        .populate('department', 'name');
      if (employee) {
        employees = [employee];
      }
    } else if (userRole === 'hr') {
      // HR can see all employees (excluding managers and admins)
      // Get all users with employee role
      const employeeUsers = await User.find({ role: 'employee' }).select('_id');
      const employeeUserIds = employeeUsers.map(u => u._id);
      
      employees = await Employee.find({ userId: { $in: employeeUserIds } })
        .populate('department', 'name')
        .populate('userId', 'name email role');
    } else if (userRole === 'manager') {
      // Manager can see HR and employees (excluding admins)
      const managerViewableUsers = await User.find({ 
        role: { $in: ['employee', 'hr'] } 
      }).select('_id');
      const managerViewableUserIds = managerViewableUsers.map(u => u._id);
      
      employees = await Employee.find({ userId: { $in: managerViewableUserIds } })
        .populate('department', 'name')
        .populate('userId', 'name email role');
    } else if (userRole === 'admin') {
      // Admin can see everyone
      employees = await Employee.find({})
        .populate('department', 'name')
        .populate('userId', 'name email role');
    }

    res.json(employees);
  } catch (error) {
    console.error('Error fetching viewable employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all attendance records with filters (role-based)
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, employeeId, status } = req.query;
    const query = {};
    const userRole = req.user.role;

    // Role-based filtering
    if (userRole === 'employee') {
      // Employees can only see their own attendance
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: 'Employee profile not found' });
      }
      query.employee = employee._id;
    } else if (userRole === 'hr') {
      // HR can see all employees' attendance (excluding managers and admins)
      const employeeUsers = await User.find({ role: 'employee' }).select('_id');
      const employeeUserIds = employeeUsers.map(u => u._id);
      const employees = await Employee.find({ userId: { $in: employeeUserIds } }).select('_id');
      const employeeIds = employees.map(emp => emp._id);
      query.employee = { $in: employeeIds };
    } else if (userRole === 'manager') {
      // Manager can see HR and employees' attendance (excluding admins)
      const managerViewableUsers = await User.find({ 
        role: { $in: ['employee', 'hr'] } 
      }).select('_id');
      const managerViewableUserIds = managerViewableUsers.map(u => u._id);
      const employees = await Employee.find({ userId: { $in: managerViewableUserIds } }).select('_id');
      const employeeIds = employees.map(emp => emp._id);
      query.employee = { $in: employeeIds };
    }
    // Admin can see everyone's attendance (no additional filter)

    // Apply additional filters
    if (employeeId && (userRole === 'admin' || userRole === 'manager' || userRole === 'hr')) {
      query.employee = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .populate('markedBy', 'username')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .populate('markedBy', 'username');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get attendance summary for an employee
router.get('/summary/:employeeId', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { employee: req.params.employeeId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(query);

    const summary = {
      totalDays: records.length,
      present: records.filter(r => r.status === 'Present').length,
      absent: records.filter(r => r.status === 'Absent').length,
      late: records.filter(r => r.status === 'Late').length,
      halfDay: records.filter(r => r.status === 'Half Day').length,
      leave: records.filter(r => r.status === 'Leave').length,
      totalWorkHours: records.reduce((sum, r) => sum + r.workHours, 0),
      averageWorkHours: records.length > 0 
        ? (records.reduce((sum, r) => sum + r.workHours, 0) / records.length).toFixed(2)
        : 0
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark attendance (create new record)
router.post('/', protect, async (req, res) => {
  try {
    const { employee, date, checkIn, checkOut, status, notes } = req.body;

    // Check if employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      employee,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = new Attendance({
      employee,
      date: new Date(date),
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      status,
      notes,
      markedBy: req.user.id
    });

    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .populate('markedBy', 'username');

    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check-in
router.post('/check-in', protect, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        date: today,
        checkIn: new Date(),
        status: 'Present',
        markedBy: req.user.id
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'Present';
    }

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .populate('markedBy', 'username');

    res.json(populatedAttendance);
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check-out
router.post('/check-out', protect, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .populate('markedBy', 'username');

    res.json(populatedAttendance);
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update attendance record
router.put('/:id', protect, async (req, res) => {
  try {
    const { checkIn, checkOut, status, notes } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (checkIn) attendance.checkIn = new Date(checkIn);
    if (checkOut) attendance.checkOut = new Date(checkOut);
    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        populate: {
          path: 'department',
          select: 'name'
        }
      })
      .populate('markedBy', 'username');

    res.json(populatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete attendance record
router.delete('/:id', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk mark attendance for multiple employees
router.post('/bulk', protect, async (req, res) => {
  try {
    const { employeeIds, date, status, notes } = req.body;

    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'Employee IDs are required' });
    }

    const attendanceDate = new Date(date);
    const results = [];
    const errors = [];

    for (const employeeId of employeeIds) {
      try {
        // Check if already exists
        const existing = await Attendance.findOne({
          employee: employeeId,
          date: attendanceDate
        });

        if (existing) {
          errors.push({ employeeId, message: 'Already marked' });
          continue;
        }

        const attendance = new Attendance({
          employee: employeeId,
          date: attendanceDate,
          status,
          notes,
          markedBy: req.user.id
        });

        await attendance.save();
        results.push(attendance);
      } catch (err) {
        errors.push({ employeeId, message: err.message });
      }
    }

    res.json({
      message: 'Bulk attendance marking completed',
      created: results.length,
      errors: errors.length,
      results,
      errors
    });
  } catch (error) {
    console.error('Error bulk marking attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

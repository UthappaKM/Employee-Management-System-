const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { protect, hrOrAdmin } = require('../middleware/auth');

// Helper function to calculate business days
const calculateBusinessDays = (startDate, endDate, isHalfDay) => {
  if (isHalfDay) return 0.5;
  
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // Exclude weekends
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
};

// @route   POST /api/leave-requests
// @desc    Create leave request
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, isHalfDay, halfDaySession, reason } = req.body;
    
    const employee = await Employee.findOne({ userId: req.user._id }).populate('manager');
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = calculateBusinessDays(start, end, isHalfDay);
    
    // Check if employee has sufficient balance
    const currentYear = new Date().getFullYear();
    const balance = await LeaveBalance.findOne({
      employee: employee._id,
      leaveType: leaveType,
      year: currentYear
    });
    
    if (!balance) {
      return res.status(400).json({ message: 'Leave balance not initialized for this leave type' });
    }
    
    const availableBalance = balance.totalQuota + balance.carriedForward - balance.used - balance.pending;
    if (availableBalance < totalDays) {
      return res.status(400).json({ message: `Insufficient leave balance. Available: ${availableBalance} days` });
    }
    
    // Create approval chain
    const approvalChain = [];
    
    // Add manager to approval chain if exists
    if (employee.manager && employee.manager.userId) {
      approvalChain.push({
        approver: employee.manager.userId,
        role: 'manager',
        status: 'pending'
      });
    }
    
    const leaveRequest = await LeaveRequest.create({
      employee: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      isHalfDay,
      halfDaySession: isHalfDay ? halfDaySession : null,
      totalDays,
      reason,
      status: 'pending',
      approvalChain,
      currentApprover: approvalChain.length > 0 ? 'manager' : 'hr'
    });
    
    // Update pending balance
    balance.pending += totalDays;
    await balance.save();
    
    const populatedRequest = await LeaveRequest.findById(leaveRequest._id)
      .populate('employee', 'firstName lastName email')
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email');
    
    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leave-requests/my-requests
// @desc    Get leave requests for logged-in employee
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }
    
    const { status, year } = req.query;
    let query = { employee: employee._id };
    
    if (status) {
      query.status = status;
    }
    
    if (year) {
      const yearNum = parseInt(year);
      const startOfYear = new Date(yearNum, 0, 1);
      const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59);
      query.startDate = { $gte: startOfYear, $lte: endOfYear };
    }
    
    const requests = await LeaveRequest.find(query)
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leave-requests/pending-approvals
// @desc    Get pending leave requests for approval (Manager/HR)
// @access  Private
router.get('/pending-approvals', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = { status: 'pending' };
    
    if (userRole === 'manager') {
      // Get manager's employee record
      const managerEmployee = await Employee.findOne({ userId: req.user._id });
      if (!managerEmployee) {
        return res.json([]);
      }
      
      // Get all employees under this manager
      const teamMembers = await Employee.find({ manager: managerEmployee._id });
      const teamMemberIds = teamMembers.map(emp => emp._id);
      
      query.employee = { $in: teamMemberIds };
      query.currentApprover = 'manager';
    } else if (userRole === 'hr') {
      query.currentApprover = { $in: ['manager', 'hr'] };
    }
    // Admin sees all pending requests
    
    const requests = await LeaveRequest.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName email position department',
        populate: { path: 'department', select: 'name' }
      })
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave-requests/:id/approve
// @desc    Approve leave request
// @access  Private (Manager/HR/Admin)
router.put('/:id/approve', protect, async (req, res) => {
  try {
    const { comments } = req.body;
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('employee')
      .populate('leaveType');
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    const userRole = req.user.role;
    
    // Check authorization
    if (userRole === 'manager') {
      if (leaveRequest.currentApprover !== 'manager') {
        return res.status(403).json({ message: 'Not authorized to approve at this stage' });
      }
      
      // Verify this manager manages the employee
      const managerEmployee = await Employee.findOne({ userId: req.user._id });
      if (!leaveRequest.employee.manager || !leaveRequest.employee.manager.equals(managerEmployee._id)) {
        return res.status(403).json({ message: 'Not authorized to approve this request' });
      }
    }
    
    // Update approval chain
    const approvalIndex = leaveRequest.approvalChain.findIndex(
      approval => approval.role === userRole && approval.status === 'pending'
    );
    
    if (approvalIndex !== -1) {
      leaveRequest.approvalChain[approvalIndex].status = 'approved';
      leaveRequest.approvalChain[approvalIndex].comments = comments;
      leaveRequest.approvalChain[approvalIndex].actionDate = new Date();
    }
    
    // Check if all approvals are complete
    const allApproved = leaveRequest.approvalChain.every(approval => approval.status === 'approved');
    
    if (allApproved || userRole === 'admin') {
      leaveRequest.status = 'approved';
      leaveRequest.currentApprover = null;
      
      // Update leave balance
      const currentYear = new Date().getFullYear();
      const balance = await LeaveBalance.findOne({
        employee: leaveRequest.employee._id,
        leaveType: leaveRequest.leaveType._id,
        year: currentYear
      });
      
      if (balance) {
        balance.pending -= leaveRequest.totalDays;
        balance.used += leaveRequest.totalDays;
        await balance.save();
      }
      
      // Create attendance records
      await createAttendanceRecords(leaveRequest);
    } else if (userRole === 'manager') {
      leaveRequest.currentApprover = 'hr';
    }
    
    await leaveRequest.save();
    
    const updatedRequest = await LeaveRequest.findById(leaveRequest._id)
      .populate('employee', 'firstName lastName email')
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email');
    
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error approving leave request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave-requests/:id/reject
// @desc    Reject leave request
// @access  Private (Manager/HR/Admin)
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('employee');
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    const userRole = req.user.role;
    
    // Check authorization
    if (userRole === 'manager') {
      if (leaveRequest.currentApprover !== 'manager') {
        return res.status(403).json({ message: 'Not authorized to reject at this stage' });
      }
      
      const managerEmployee = await Employee.findOne({ userId: req.user._id });
      if (!leaveRequest.employee.manager || !leaveRequest.employee.manager.equals(managerEmployee._id)) {
        return res.status(403).json({ message: 'Not authorized to reject this request' });
      }
    }
    
    leaveRequest.status = 'rejected';
    leaveRequest.rejectionReason = rejectionReason;
    leaveRequest.currentApprover = null;
    
    // Update approval chain
    const approvalIndex = leaveRequest.approvalChain.findIndex(
      approval => approval.role === userRole && approval.status === 'pending'
    );
    
    if (approvalIndex !== -1) {
      leaveRequest.approvalChain[approvalIndex].status = 'rejected';
      leaveRequest.approvalChain[approvalIndex].comments = rejectionReason;
      leaveRequest.approvalChain[approvalIndex].actionDate = new Date();
    }
    
    // Release pending balance
    const currentYear = new Date().getFullYear();
    const balance = await LeaveBalance.findOne({
      employee: leaveRequest.employee._id,
      leaveType: leaveRequest.leaveType,
      year: currentYear
    });
    
    if (balance) {
      balance.pending -= leaveRequest.totalDays;
      await balance.save();
    }
    
    await leaveRequest.save();
    
    const updatedRequest = await LeaveRequest.findById(leaveRequest._id)
      .populate('employee', 'firstName lastName email')
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email');
    
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave-requests/:id/cancel
// @desc    Cancel leave request
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!leaveRequest.employee.equals(employee._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }
    
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }
    
    leaveRequest.status = 'cancelled';
    leaveRequest.currentApprover = null;
    
    // Release pending balance
    const currentYear = new Date().getFullYear();
    const balance = await LeaveBalance.findOne({
      employee: leaveRequest.employee,
      leaveType: leaveRequest.leaveType,
      year: currentYear
    });
    
    if (balance) {
      balance.pending -= leaveRequest.totalDays;
      await balance.save();
    }
    
    await leaveRequest.save();
    
    const updatedRequest = await LeaveRequest.findById(leaveRequest._id)
      .populate('employee', 'firstName lastName email')
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email');
    
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leave-requests/all
// @desc    Get all leave requests (HR/Admin)
// @access  Private (HR/Admin)
router.get('/all', protect, hrOrAdmin, async (req, res) => {
  try {
    const { status, month, year, employee } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (employee) {
      query.employee = employee;
    }
    
    if (year || month) {
      const yearNum = parseInt(year) || new Date().getFullYear();
      const monthNum = month ? parseInt(month) - 1 : null;
      
      if (monthNum !== null) {
        const startOfMonth = new Date(yearNum, monthNum, 1);
        const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59);
        query.$or = [
          { startDate: { $gte: startOfMonth, $lte: endOfMonth } },
          { endDate: { $gte: startOfMonth, $lte: endOfMonth } }
        ];
      } else {
        const startOfYear = new Date(yearNum, 0, 1);
        const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59);
        query.$or = [
          { startDate: { $gte: startOfYear, $lte: endOfYear } },
          { endDate: { $gte: startOfYear, $lte: endOfYear } }
        ];
      }
    }
    
    const requests = await LeaveRequest.find(query)
      .populate({
        path: 'employee',
        select: 'firstName lastName email position department',
        populate: { path: 'department', select: 'name' }
      })
      .populate('leaveType')
      .populate('approvalChain.approver', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all leave requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to create attendance records for approved leave
async function createAttendanceRecords(leaveRequest) {
  try {
    if (leaveRequest.attendanceCreated) return;
    
    const currentDate = new Date(leaveRequest.startDate);
    const endDate = new Date(leaveRequest.endDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Check if attendance record already exists
        const existingRecord = await Attendance.findOne({
          employee: leaveRequest.employee,
          date: {
            $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(currentDate.setHours(23, 59, 59, 999))
          }
        });
        
        if (!existingRecord) {
          await Attendance.create({
            employee: leaveRequest.employee,
            date: new Date(currentDate),
            status: 'present',
            leaveType: leaveRequest.leaveType,
            isLeave: true,
            isHalfDay: leaveRequest.isHalfDay && 
                       currentDate.toDateString() === leaveRequest.startDate.toDateString(),
            halfDaySession: leaveRequest.isHalfDay && 
                           currentDate.toDateString() === leaveRequest.startDate.toDateString()
                           ? leaveRequest.halfDaySession : null,
            notes: `Leave: ${leaveRequest.reason}`
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    leaveRequest.attendanceCreated = true;
    await leaveRequest.save();
  } catch (error) {
    console.error('Error creating attendance records:', error);
  }
}

module.exports = router;

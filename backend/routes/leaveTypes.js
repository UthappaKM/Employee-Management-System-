const express = require('express');
const router = express.Router();
const LeaveType = require('../models/LeaveType');
const { protect, hr, admin, hrOrAdmin } = require('../middleware/auth');

// @route   GET /api/leave-types
// @desc    Get all leave types
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({ isActive: true }).sort({ name: 1 });
    res.json(leaveTypes);
  } catch (error) {
    console.error('Error fetching leave types:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/leave-types
// @desc    Create leave type
// @access  Private (HR/Admin)
router.post('/', protect, hrOrAdmin, async (req, res) => {
  try {
    const leaveType = await LeaveType.create(req.body);
    res.status(201).json(leaveType);
  } catch (error) {
    console.error('Error creating leave type:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave-types/:id
// @desc    Update leave type
// @access  Private (HR/Admin)
router.put('/:id', protect, hrOrAdmin, async (req, res) => {
  try {
    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    
    res.json(leaveType);
  } catch (error) {
    console.error('Error updating leave type:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/leave-types/:id
// @desc    Delete leave type (soft delete)
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    
    res.json({ message: 'Leave type deactivated successfully' });
  } catch (error) {
    console.error('Error deleting leave type:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

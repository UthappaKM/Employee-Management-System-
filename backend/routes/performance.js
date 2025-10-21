const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Performance = require('../models/Performance');
const { protect, adminOrManager, hrManagerOrAdmin } = require('../middleware/auth');

// @route   GET /api/performance
// @desc    Get all performance reviews (filtered by role)
// @access  Private (Admin/HR see all, Manager sees dept, Employee sees own)
router.get('/', protect, async (req, res) => {
  try {
    const { status, employee } = req.query;
    let query = {};

    // Employee: See only their own reviews
    if (req.user.role === 'employee') {
      const Employee = require('../models/Employee');
      const employeeRecord = await Employee.findOne({ email: req.user.email });
      
      if (employeeRecord) {
        query.employee = employeeRecord._id;
      } else {
        return res.json([]);
      }
    }
    
    // Manager: See only their department's reviews
    if (req.user.role === 'manager') {
      const Employee = require('../models/Employee');
      const managerRecord = await Employee.findOne({ email: req.user.email });
      
      if (managerRecord && managerRecord.department) {
        const deptEmployees = await Employee.find({ department: managerRecord.department }).select('_id');
        const employeeIds = deptEmployees.map(emp => emp._id);
        query.employee = { $in: employeeIds };
      } else {
        return res.json([]);
      }
    }

    // Admin & HR: See all reviews (no additional filter)

    // Apply additional filters
    if (status) {
      query.status = status;
    }

    if (employee) {
      query.employee = employee;
    }

    const reviews = await Performance.find(query)
      .populate('employee', 'firstName lastName email position')
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/performance/employee/:employeeId
// @desc    Get performance reviews for specific employee
// @access  Private
router.get('/employee/:employeeId', protect, async (req, res) => {
  try {
    const reviews = await Performance.find({ employee: req.params.employeeId })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/performance/:id
// @desc    Get performance review by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const review = await Performance.findById(req.params.id)
      .populate('employee', 'firstName lastName email position department')
      .populate('reviewer', 'name email role');

    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/performance
// @desc    Create new performance review
// @access  Private (Admin/Manager)
router.post('/', [
  protect,
  adminOrManager,
  body('employee').notEmpty().withMessage('Employee is required'),
  body('reviewPeriod.startDate').notEmpty().withMessage('Start date is required'),
  body('reviewPeriod.endDate').notEmpty().withMessage('End date is required'),
  body('overallRating').isFloat({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviewData = {
      ...req.body,
      reviewer: req.user._id
    };

    const review = await Performance.create(reviewData);

    const populatedReview = await Performance.findById(review._id)
      .populate('employee', 'firstName lastName email position')
      .populate('reviewer', 'name email');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/performance/:id
// @desc    Update performance review
// @access  Private (Admin/Manager)
router.put('/:id', protect, adminOrManager, async (req, res) => {
  try {
    let review = await Performance.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }

    review = await Performance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('employee', 'firstName lastName email position')
      .populate('reviewer', 'name email');

    res.json(review);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/performance/:id
// @desc    Delete performance review
// @access  Private (Admin/Manager)
router.delete('/:id', protect, adminOrManager, async (req, res) => {
  try {
    const review = await Performance.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Performance review not found' });
    }

    await review.deleteOne();

    res.json({ message: 'Performance review removed successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Performance review not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/performance/stats/overview
// @desc    Get performance statistics
// @access  Private (Admin/HR see all, Manager sees their dept)
router.get('/stats/overview', protect, hrManagerOrAdmin, async (req, res) => {
  try {
    let matchQuery = {};

    // Manager: Only their department's stats
    if (req.user.role === 'manager') {
      const Employee = require('../models/Employee');
      const managerRecord = await Employee.findOne({ email: req.user.email });
      
      if (managerRecord && managerRecord.department) {
        const deptEmployees = await Employee.find({ department: managerRecord.department }).select('_id');
        const employeeIds = deptEmployees.map(emp => emp._id);
        matchQuery.employee = { $in: employeeIds };
      } else {
        return res.json({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: [],
          statusDistribution: []
        });
      }
    }

    // Admin & HR: All stats (no filter)

    const totalReviews = await Performance.countDocuments(matchQuery);
    const avgRating = await Performance.aggregate([
      ...(Object.keys(matchQuery).length > 0 ? [{ $match: matchQuery }] : []),
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$overallRating' }
        }
      }
    ]);

    const ratingDistribution = await Performance.aggregate([
      ...(Object.keys(matchQuery).length > 0 ? [{ $match: matchQuery }] : []),
      {
        $group: {
          _id: '$overallRating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const statusDistribution = await Performance.aggregate([
      ...(Object.keys(matchQuery).length > 0 ? [{ $match: matchQuery }] : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalReviews,
      averageRating: avgRating.length > 0 ? avgRating[0].averageRating.toFixed(2) : 0,
      ratingDistribution,
      statusDistribution
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please specify the employee']
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify the reviewer']
  },
  reviewPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Please specify start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify end date']
    }
  },
  overallRating: {
    type: Number,
    required: [true, 'Please provide an overall rating'],
    min: 1,
    max: 5
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comments: {
      type: String,
      trim: true
    }
  }],
  strengths: [{
    type: String,
    trim: true
  }],
  areasForImprovement: [{
    type: String,
    trim: true
  }],
  goals: [{
    description: {
      type: String,
      required: true,
      trim: true
    },
    targetDate: Date,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'delayed'],
      default: 'not-started'
    }
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  comments: {
    type: String,
    trim: true
  },
  employeeFeedback: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'acknowledged'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
performanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Performance', performanceSchema);

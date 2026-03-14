const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: [true, 'Certificate ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    internshipDomain: {
      type: String,
      required: [true, 'Internship domain is required'],
      trim: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    qrCodeURL: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for fast lookups
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ studentName: 'text', internshipDomain: 'text' });

module.exports = mongoose.model('Certificate', certificateSchema);

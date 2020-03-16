const mongoose = require('../../../database/database');

const ResultSchema = new mongoose.Schema(
  {
    notificationLevel: {
      type: String,
      enum: ['Success', 'Error', 'Warning', 'Timeout'],
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    message: {
      type: String
    },
    resetPasswordToken: {
      type: String
    }
  },
  { _id: false }
);

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;

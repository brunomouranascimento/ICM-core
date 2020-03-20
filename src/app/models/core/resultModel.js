const mongoose = require('../../../database/database');

const ResultSchema = new mongoose.Schema(
  {
    success: {
      type: Boolean
    },
    error: {
      type: Boolean
    },
    data: {
      type: mongoose.Schema.Types.Mixed
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

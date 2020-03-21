const mongoose = require('../../database/database');

const AuditSchema = new mongoose.Schema({
  statusCode: {
    type: Number,
    required: true
  },
  statusMessage: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  route: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  body: {
    type: mongoose.Schema.Types.Mixed
  },
  processingTime: {
    type: Number,
    required: true
  },
  completeAudit: {
    type: String,
    required: true
  }
});

const Audit = mongoose.model('Audit', AuditSchema);

module.exports = Audit;

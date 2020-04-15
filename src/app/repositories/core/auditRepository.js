const Audit = require('../../models/auditModel');

class AuditRepository {
  async index() {
    try {
      const audits = await Audit.find().populate('user');
      return audits;
    } catch (error) {
      return error;
    }
  }
}

module.exports = new AuditRepository();

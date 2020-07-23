const Audit = require('../../models/auditModel');

module.exports = {
  async index() {
    try {
      const audits = await Audit.find().populate('user');
      return audits;
    } catch (error) {
      return error;
    }
  },
};

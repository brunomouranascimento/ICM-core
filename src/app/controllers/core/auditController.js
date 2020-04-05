const Audit = require('../../models/auditModel');

class AuditController {
  async index(request, response) {
    try {
      const audits = await Audit.find().populate('user');
      return response.status(200).send({
        data: audits,
        message: audits.length
          ? 'Audits loaded.'
          : 'There are no audits registered.'
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new AuditController();

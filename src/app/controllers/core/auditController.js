const Audit = require('../../models/core/auditModel');
const Result = require('../../models/core/resultModel');

module.exports = {
  async index(request, response) {
    try {
      const audits = await Audit.find().populate('user');
      return response.status(200).send(
        new Result({
          data: audits,
          notificationLevel: audits.length ? 'Success' : 'Warning',
          message: audits.length
            ? 'Audits loaded.'
            : 'There are no audits registered.'
        })
      );
    } catch (err) {
      console.log(err);
    }
  }
};

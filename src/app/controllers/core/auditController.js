const Audit = require('../../models/core/auditModel');
const Result = require('../../models/core/resultModel');

module.exports = {
  async index(request, response) {
    try {
      const audits = await Audit.find().populate('user');
      return response.status(200).send(
        new Result({
          data: audits,
          error: audits.length !== null ? false : true,
          success: audits.length !== null ? true : false,
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

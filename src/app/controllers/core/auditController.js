const repository = require('../../repositories/core/auditRepository');

module.exports = {
  async index(request, response) {
    try {
      const audits = await repository.index();
      return response.status(200).send({
        data: audits,
        message: audits.length ? 'Audits loaded.' : 'Audits not found.',
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};

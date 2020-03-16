const Church = require('../models/churchModel');
const Result = require('../../app/models/core/resultModel');

module.exports = {
  async index(request, response) {
    const churchs = await Church.find().populate(['user']);
    return response.status(200).send(
      new Result({
        data: churchs,
        notificationLevel: 'Success',
        message: 'Churchs loaded.'
      })
    );
  },
  async show(request, response) {
    const { id } = request.params.id;

    const church = await Church.findById(id);

    if (!church)
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Church not found.'
        })
      );

    return response.status(200).send(
      new Result({
        data: church,
        notificationLevel: 'Success',
        message: 'Churchs loaded.'
      })
    );
  },
  async store(request, response) {
    try {
      const { name, address } = request.body;

      const church = await Church.create({
        name,
        address,
        user: request.userId
      });

      await church.save();

      return response.status(200).send(
        new Result({
          data: church,
          notificationLevel: 'Success',
          message: 'Church inserted.'
        })
      );
    } catch (err) {
      console.log(err);
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on inserting church.'
        })
      );
    }
  }
};

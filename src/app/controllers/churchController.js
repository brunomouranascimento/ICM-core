const Church = require('../models/churchModel');
const Result = require('../models/core/resultModel');

module.exports = {
  async index(request, response) {
    try {
      const churchs = await Church.find().populate(['createdBy', 'updatedBy']);
      return response.status(200).send(
        new Result({
          data: churchs,
          notificationLevel: churchs.length ? 'Success' : 'Waring',
          message: churchs.length
            ? 'Churchs loaded.'
            : 'There are no churchs registered.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          error: true,
          message: 'Error on finding churchs.'
        })
      );
    }
  },
  async show(request, response) {
    try {
      const church = await Church.findById(request.params.id);
      return response.status(200).send(
        new Result({
          data: church,
          error: church !== null ? false : true,
          success: church !== null ? true : false,
          message: church !== null ? 'Church founded.' : 'Church not founded.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          error: true,
          message: 'Error on finding church.'
        })
      );
    }
  },
  async store(request, response) {
    try {
      const { name, address } = request.body;

      const church = await Church.create({
        name,
        address,
        createdBy: request.userId
      });

      await church.save();

      return response.status(200).send(
        new Result({
          data: church,
          success: true,
          message: 'Church inserted.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          error: true,
          message: 'Error on inserting church.'
        })
      );
    }
  },
  async update(request, response) {
    try {
      const { name, address } = request.body;

      const church = await Church.findByIdAndUpdate(
        request.params.id,
        {
          name,
          address
        },
        { new: true }
      );

      church.updatedAt = new Date();
      church.updatedBy = request.userId;

      await church.save();
      return response.status(200).send(
        new Result({
          data: church,
          success: true,
          message: 'Church updated.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          error: true,
          message: 'Error on updating church.'
        })
      );
    }
  },
  async destroy(request, response) {
    try {
      await Church.findByIdAndRemove(request.params.id);
      return response.status(200).send(
        new Result({
          success: true,
          message: 'Church removed.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          error: true,
          message: 'Error on removing church.'
        })
      );
    }
  }
};

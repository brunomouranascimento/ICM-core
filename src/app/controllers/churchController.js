const repository = require('../repositories/churchRepository');

class ChurchController {
  async index(request, response) {
    try {
      const churchs = await repository.index();
      return response.status(200).send({
        data: churchs,
        message: churchs.length ? 'Churchs loaded.' : 'Churchs not found.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding churchs.'
      });
    }
  }

  async show(request, response) {
    try {
      const church = await repository.show(request.params.id);
      return response.status(200).send({
        data: church,
        message: church !== null ? 'Church founded.' : 'Church not founded.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding church.'
      });
    }
  }

  async store(request, response) {
    try {
      const { name, address } = request.body;
      const userId = request.userId;

      const church = await repository.store(name, address, userId);

      return response.status(200).send({
        data: church,
        message: 'Church inserted.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on inserting church.'
      });
    }
  }

  async update(request, response) {
    try {
      const { name, address } = request.body;
      const userId = request.userId;

      const church = await repository.update(
        request.params.id,
        name,
        address,
        userId
      );

      return response.status(200).send({
        data: church,
        message: 'Church updated.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on updating church.'
      });
    }
  }

  async destroy(request, response) {
    try {
      await repository.destroy(request.params.id);
      return response.status(200).send({
        message: 'Church removed.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on removing church.'
      });
    }
  }
}

module.exports = new ChurchController();

const repository = require('../repositories/songRepository');

class SongController {
  async index(request, response) {
    try {
      const page = request.query.page || 1;
      const songs = await repository.index(page);
      const {
        data,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        lastPage,
        message
      } = songs;
      return response.status(200).send({
        data,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        lastPage,
        message
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding songs.'
      });
    }
  }

  async show(request, response) {
    try {
      const song = await repository.show(request.params.id);
      return response.status(200).send({
        data: song,
        message: song !== null ? 'Song founded.' : 'Song not founded'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding song.'
      });
    }
  }

  async store(request, response) {
    try {
      const { name, theme } = request.body;
      const userId = request.userId;

      const song = await repository.store(name, theme, userId);

      return response.status(200).send({
        data: song,
        message: 'Song inserted.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on inserting song.'
      });
    }
  }

  async update(request, response) {
    try {
      const { name, theme } = request.body;
      const userId = request.userId;

      const song = await repository.update(
        request.params.id,
        name,
        theme,
        userId
      );

      return response.status(200).send({
        data: song,
        message: 'Song updated.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on updating song.'
      });
    }
  }

  async destroy(request, response) {
    try {
      await repository.destroy(request.params.id);
      return response.status(200).send({
        message: 'Song removed.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on removing song.'
      });
    }
  }
}

module.exports = new SongController();

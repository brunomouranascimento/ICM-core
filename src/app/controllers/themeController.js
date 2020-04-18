const repository = require('../repositories/themeRepository');

class ThemeController {
  async index(request, response) {
    try {
      const themes = await repository.index();
      return response.status(200).send({
        data: themes,
        message: themes.length ? 'Themes loaded.' : 'Themes not found.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding themes.'
      });
    }
  }

  async show(request, response) {
    try {
      const theme = await repository.show(request.params.id);
      return response.status(200).send({
        data: theme,
        message: theme !== null ? 'Theme founded.' : 'Theme not founded'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding theme.'
      });
    }
  }

  async store(request, response) {
    try {
      const { name, songs } = request.body;
      const userId = request.userId;

      const theme = await repository.store(name, songs, userId);

      return response.status(201).send({
        data: theme,
        message: 'Theme inserted.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on inserting theme.'
      });
    }
  }

  async update(request, response) {
    try {
      const { name, songs } = request.body;
      const userId = request.userId;

      const theme = await repository.update(
        request.params.id,
        name,
        songs,
        userId
      );

      return response.status(200).send({
        data: theme,
        message: 'Theme updated.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on updating theme.'
      });
    }
  }

  async destroy(request, response) {
    try {
      await repository.destroy(request.params.id);
      return response.status(200).send({
        message: 'Theme removed.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on removing theme.'
      });
    }
  }
}

module.exports = new ThemeController();

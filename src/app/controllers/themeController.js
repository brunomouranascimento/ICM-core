const Theme = require('../models/themeModel');
const Song = require('../models/songModel');

class ThemeController {
  async index(request, response) {
    try {
      const themes = await Theme.find().populate(['user', 'songs']);
      return response.status(200).send({
        data: themes,
        message: themes.length
          ? 'Themes loaded.'
          : 'There are no themes registered.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding themes.'
      });
    }
  }

  async show(request, response) {
    try {
      const theme = await Theme.findById(request.params.id);
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

      const maxThemeId = await Theme.findOne().sort({ themeId: -1 });

      const theme = await Theme.create({
        name,
        themeId: maxThemeId.themeId + 1,
        createdBy: request.userId
      });

      await Promise.all(
        songs.map(async song => {
          const themeSong = new Song({
            ...song,
            theme: theme._id,
            createdBy: request.userId
          });

          await themeSong.save();

          theme.songs.push(themeSong);
        })
      );

      await theme.save();

      return response.status(200).send({
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

      const theme = await Theme.findByIdAndUpdate(
        request.params.id,
        {
          name
        },
        { new: true }
      );

      theme.songs = [];

      await Song.remove({ theme: theme._id });

      theme.updatedAt = new Date();
      theme.updatedBy = request.userId;
      await Promise.all(
        songs.map(async song => {
          const themeSong = new Song({
            ...song,
            theme: theme._id,
            createdBy: request.userId
          });

          await themeSong.save();

          theme.songs.push(themeSong);
        })
      );

      await theme.save();

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
      await Theme.findByIdAndRemove(request.params.id);
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

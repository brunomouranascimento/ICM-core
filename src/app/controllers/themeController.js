const Theme = require('../models/themeModel');
const Song = require('../models/songModel');
const Result = require('../models/core/resultModel');

module.exports = {
  async index(request, response) {
    try {
      const themes = await Theme.find().populate(['user', 'songs']);
      return response.status(200).send(
        new Result({
          data: themes,
          notificationLevel: themes.length ? 'Success' : 'Warning',
          message: themes.length
            ? 'Themes loaded.'
            : 'There are no themes registered.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on finding themes.'
        })
      );
    }
  },
  async show(request, response) {
    try {
      const theme = await Theme.findById(request.params.id);
      return response.status(200).send(
        new Result({
          data: theme,
          notificationLevel: theme !== null ? 'Success' : 'Warning',
          message: theme !== null ? 'Theme founded.' : 'Theme not founded'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on finding theme.'
        })
      );
    }
  },
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
        songs.map(async (song) => {
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

      return response.status(200).send(
        new Result({
          data: theme,
          notificationLevel: 'Success',
          message: 'Theme inserted.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on inserting theme.'
        })
      );
    }
  },
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
        songs.map(async (song) => {
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

      return response.status(200).send(
        new Result({
          data: theme,
          notificationLevel: 'Success',
          message: 'Theme updated.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on updating theme.'
        })
      );
    }
  },
  async destroy(request, response) {
    try {
      await Theme.findByIdAndRemove(request.params.id);
      return response.status(200).send(
        new Result({
          notificationLevel: 'Success',
          message: 'Theme removed.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on removing theme.'
        })
      );
    }
  }
};

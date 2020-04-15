const Theme = require('../models/themeModel');
const Song = require('../models/songModel');

class ThemeRepository {
  async index() {
    try {
      const themes = await Theme.find().populate(['user', 'songs']);
      return themes;
    } catch (error) {
      return;
    }
  }

  async show(id) {
    try {
      const theme = await Theme.findById(id);
      return theme;
    } catch (error) {
      return error;
    }
  }

  async store(name, songs, userId) {
    try {
      const maxThemeId = await Theme.findOne().sort({ themeId: -1 });

      const theme = await Theme.create({
        name,
        themeId: maxThemeId.themeId + 1,
        createdBy: userId
      });

      await Promise.all(
        songs.map(async song => {
          const themeSong = new Song({
            ...song,
            theme: theme._id,
            createdBy: userId
          });

          await themeSong.save();

          theme.songs.push(themeSong);
        })
      );

      await theme.save();

      return theme;
    } catch (error) {
      return error;
    }
  }

  async update(id, name, songs, userId) {
    try {
      const theme = await Theme.findByIdAndUpdate(
        id,
        {
          name
        },
        { new: true }
      );

      theme.songs = [];

      await Song.deleteOne({ theme: theme._id });

      theme.updatedAt = new Date();
      theme.updatedBy = userId;
      await Promise.all(
        songs.map(async song => {
          const themeSong = new Song({
            ...song,
            theme: theme._id,
            createdBy: userId
          });

          await themeSong.save();

          theme.songs.push(themeSong);
        })
      );

      await theme.save();

      return theme;
    } catch (error) {
      return error;
    }
  }

  async destroy(id) {
    try {
      await Theme.findByIdAndRemove(id);
    } catch (error) {
      return error;
    }
  }
}

module.exports = new ThemeRepository();

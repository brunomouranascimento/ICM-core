const Theme = require('../models/themeModel');
const Song = require('../models/songModel');

class ThemeRepository {
  async index() {
    try {
      this.themes = await Theme.find().populate(['user', 'songs']);
      return this.themes;
    } catch (error) {
      return error;
    }
  }

  async show(id) {
    try {
      this.theme = await Theme.findById(id);
      return this.theme;
    } catch (error) {
      return error;
    }
  }

  async store(name, songs, userId) {
    try {
      this.maxThemeId = await Theme.findOne().sort({ themeId: -1 });

      const theme = await Theme.create({
        name,
        themeId: this.maxThemeId.themeId + 1,
        createdBy: userId,
      });

      await Promise.all(
        songs.map(async (song) => {
          const themeSong = new Song({
            ...song,
            theme: theme._id,
            createdBy: userId,
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
      this.theme = await Theme.findByIdAndUpdate(
        id,
        {
          name,
        },
        { new: true }
      );

      this.theme.songs = [];

      await Song.deleteOne({ theme: theme._id });

      this.theme.updatedAt = new Date();
      this.theme.updatedBy = userId;
      await Promise.all(
        songs.map(async (song) => {
          const themeSong = new Song({
            ...song,
            theme: theme._id,
            createdBy: userId,
          });

          await themeSong.save();

          this.theme.songs.push(themeSong);
        })
      );

      await this.theme.save();

      return this.theme;
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

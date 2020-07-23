const Song = require('../models/songModel');

const SONGS_PER_PAGE = 3;

module.exports = {
  async index(page) {
    try {
      const totalSongs = await Song.find().countDocuments();
      const songs = await Song.find()
        .skip((page - 1) * SONGS_PER_PAGE)
        .limit(SONGS_PER_PAGE)
        .populate('user');
      return {
        data: songs,
        totalCount: totalSongs,
        hasNextPage: SONGS_PER_PAGE * page < totalSongs,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(totalSongs / SONGS_PER_PAGE),
        message: songs.length ? 'Songs loaded.' : 'Songs not found.',
      };
    } catch (error) {
      return error;
    }
  },

  async show(id) {
    try {
      const song = await Song.findById(id);
      return song;
    } catch (error) {
      return error;
    }
  },

  async store(name, theme, userId) {
    try {
      const song = await Song.create({
        name,
        theme,
        createdBy: userId,
      });

      await song.save();

      return song;
    } catch (error) {
      return error;
    }
  },

  async update(id, name, theme, userId) {
    try {
      const song = await Song.findByIdAndUpdate(
        id,
        {
          name,
          theme,
        },
        { new: true }
      );

      song.updatedAt = new Date();
      song.updatedBy = userId;

      await song.save();

      return song;
    } catch (error) {
      return error;
    }
  },

  async destroy(id) {
    try {
      await Song.findByIdAndRemove(id);
      return true;
    } catch (error) {
      return error;
    }
  },
};

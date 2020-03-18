const Song = require('../models/songModel');
const Result = require('../models/core/resultModel');

module.exports = {
  async index(request, response) {
    try {
      const songs = await Song.find().populate('user');
      return response.status(200).send(
        new Result({
          data: songs,
          notificationLevel: songs.length ? 'Success' : 'Warning',
          message: songs.length
            ? 'Songs loaded.'
            : 'There are no songs registered.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on finding songs.'
        })
      );
    }
  },
  async show(request, response) {
    try {
      const song = await Song.findById(request.params.id);
      return response.status(200).send(
        new Result({
          data: song,
          notificationLevel: song !== null ? 'Success' : 'Warning',
          message: song !== null ? 'Song founded.' : 'Song not founded'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on finding song.'
        })
      );
    }
  },
  async store(request, response) {
    try {
      const { name, theme } = request.body;

      const song = await Song.create({
        name,
        theme: Song.schema.path('theme').enumValues[theme],
        createdBy: request.userId
      });

      await song.save();

      return response.status(200).send(
        new Result({
          data: song,
          notificationLevel: 'Success',
          message: 'Song inserted.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on inserting song.'
        })
      );
    }
  },
  async update(request, response) {
    try {
      const { name, theme } = request.body;

      const song = await Song.findByIdAndUpdate(
        request.params.id,
        {
          name,
          theme: Song.schema.path('theme').enumValues[theme]
        },
        { new: true }
      );

      song.updatedAt = new Date();
      song.updatedBy = request.userId;

      await song.save();
      return response.status(200).send(
        new Result({
          data: song,
          notificationLevel: 'Success',
          message: 'Song updated.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on updating song.'
        })
      );
    }
  },
  async destroy(request, response) {
    try {
      await Song.findByIdAndRemove(request.params.id);
      return response.status(200).send(
        new Result({
          notificationLevel: 'Success',
          message: 'Song removed.'
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on removing song.'
        })
      );
    }
  }
};

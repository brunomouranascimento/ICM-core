const Song = require('../models/songModel');

const SONGS_PER_PAGE = 3;

class SongController {
  async index(request, response) {
    try {
      const page = request.query.page;
      const songs = await Song.find()
        .skip((page - 1) * SONGS_PER_PAGE)
        .limit(SONGS_PER_PAGE)
        .populate('user');
      return response.status(200).send({
        data: songs,
        message: songs.length
          ? 'Songs loaded.'
          : 'There are no songs registered.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on finding songs.'
      });
    }
  }

  async show(request, response) {
    try {
      const song = await Song.findById(request.params.id);
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

      const song = await Song.create({
        name,
        theme: Song.schema.path('theme').enumValues[theme],
        createdBy: request.userId
      });

      await song.save();

      return response.status(200).send(
        new Result({
          data: song,
          message: 'Song inserted.'
        })
      );
    } catch (error) {
      return response.status(400).send({
        message: 'Error on inserting song.'
      });
    }
  }

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
      await Song.findByIdAndRemove(request.params.id);
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

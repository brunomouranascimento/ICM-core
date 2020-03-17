const mongoose = require('../../database/database');

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    enum: [
      'Pleading',
      'Invocation and Communion',
      'Death, Ressurection and Salvation',
      'Dedication',
      'Comfort and Encouragement',
      'Sanctification and Outpouring of the Holy Spirit',
      'Eternity and the Return of Jesus',
      'Praise',
      'Praise Group',
      'Children And Adolescents'
    ],
    required: true
  },
  lastPlayed: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;

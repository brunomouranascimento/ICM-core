const mongoose = require('../../database/database');

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  themeId: {
    type: Number,
    unique: true,
    required: true
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }
  ],
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

const Theme = mongoose.model('Theme', ThemeSchema);

module.exports = Theme;

const mongoose = require('../../database/database');

const ChurchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

const Church = mongoose.model('Church', ChurchSchema);

module.exports = Church;

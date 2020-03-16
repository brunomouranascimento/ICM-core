const mongoose = require('../../database/database');
const bcrypt = require('bcryptjs');

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

ChurchSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const Church = mongoose.model('Church', ChurchSchema);

module.exports = Church;

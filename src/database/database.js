const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://brunonascimento:dAwtGfZjrJN6Y4Ta@cluster0-yv9b6.gcp.mongodb.net/ICM?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);
mongoose.Promise = global.Promise;

module.exports = mongoose;

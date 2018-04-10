var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //mongooose now uses normal js promisses
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
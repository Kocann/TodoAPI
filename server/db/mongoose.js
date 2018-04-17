var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //mongooose now uses normal js promisses

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
}
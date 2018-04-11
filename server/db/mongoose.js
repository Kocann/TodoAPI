var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //mongooose now uses normal js promisses

let db = {
  mlab: 'mongodb://ann:ann@ds241869.mlab.com:41869/todoappapp',
  localhost: 'mongodb://localhost:27017/TodoApp'
}

mongoose.connect(process.env.PORT ? db.mlab : db.localhost);

module.exports = {
  mongoose
}
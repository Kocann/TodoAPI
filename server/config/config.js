var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key]
  })
}


// let db = {
//   mlab: 'mongodb://ann:ann@ds241869.mlab.com:41869/todoappapp',
//   localhost: 'mongodb://localhost:27017/TodoApp',
//   localhostTest: 'mongodb://localhost:27017/TodoAppTEST'
// }

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = db.localhost;
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = db.localhostTest;
// } else {
//   process.env.MONGODB_URI = db.mlab;
//}
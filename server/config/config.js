var env = process.env.NODE_ENV || 'development';

let db = {
  mlab: 'mongodb://ann:ann@ds241869.mlab.com:41869/todoappapp',
  localhost: 'mongodb://localhost:27017/TodoApp',
  localhostTest: 'mongodb://localhost:27017/TodoAppTEST'
}

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = db.localhost;
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = db.localhostTest;
} else {
  process.env.MONGODB_URI = db.mlab;
}
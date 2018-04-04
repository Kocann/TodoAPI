// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb'); //with destructuring! MongoClient gets assigned to MongoClient on required 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) { return console.log(`unalble to connect to mongo, err is ${err}`)};
  console.log('Conncected successfully to mongodb');
 
  const db = client.db('TodoApp')

  //findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate(
  //   { completed: true },
  //   {
  //     $set: {
  //       completed: false
  //     }
  //   },
  //   {
  //     returnOriginal: false
  //   }
  // ).then(result => console.log(result))

  db.collection('Users').findOneAndUpdate(
    { age: 26 },
    {
      $inc: {
        age: 1
      }
    },
    {
      returnOriginal: false
    }
  ).then(result => console.log(result))

  client.close();
});
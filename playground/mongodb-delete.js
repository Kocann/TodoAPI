// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb'); //with destructuring! MongoClient gets assigned to MongoClient on required 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) { return console.log(`unalble to connect to mongo, err is ${err}`)};
  console.log('Conncected successfully to mongodb');
 
  const db = client.db('TodoApp')

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'eat'})
  //                       .then((result) => {
  //                         console.log(result);
  //                       });
  
  //deteleOne
  // db.collection('Todos').deleteOne({text: 'eat'})
  // .then((result) => {
  //   console.log(result);
  // });
  
  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false})
  // .then((result) => {
  //   console.log(result);
  // });


  //client.close();
});
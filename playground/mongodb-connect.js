// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //with destructuring! MongoClient gets assigned to MongoClient on required 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) { return console.log(`unalble to connect to mongo, err is ${err}`)};
  console.log('Conncected successfully to mongodb');
 
  const db = client.db('TodoApp')
  // db.collection('Todos').insertOne({
  //   text: 'smething',
  //   completed: false
  // }, (err, result) => {
  //   if (err) { return console.log('error occured') }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  db.collection('Users').insertOne({
    name: 'Danuta',
    age: 62,
    location: "Krk"
  }, (err, result) => {
    if (err) { return console.log('error occured') }
    console.log(JSON.stringify(result.ops, undefined, 2)); //ops returns all documents inserted
  })
  
  client.close();
});
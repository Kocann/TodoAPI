// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //with destructuring! MongoClient gets assigned to MongoClient on required 'mongodb'

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) { return console.log(`unalble to connect to mongo, err is ${err}`)};
  console.log('Conncected successfully to mongodb');
 
  const db = client.db('TodoApp')
  
  // db.collection('Todos').find({
  //   completed: false
  // }).toArray()
  //   .then((docs) => {
  //   console.log('todos: ');
  //   console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //     console.log('unalble to fetch todos', err)
  //   })
  
  // db.collection('Todos').find({
  //   _id: new ObjectID('5ac50aabf0c7541ed41dcf62')
  // }).toArray()
  //   .then((docs) => {
  //   console.log('todos: ');
  //   console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //     console.log('unalble to fetch todos', err)
  //   })

  db.collection('Todos').find({}).count()
    .then((count) => {
    console.log('todos count: ');
    console.log(JSON.stringify(count, undefined, 2));
    }, (err) => {
      console.log('unalble to fetch todos', err)
    })

  client.close();
});
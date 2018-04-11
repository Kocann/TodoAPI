const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectId} = require('mongodb');

var id = '5ace48a95d0a84018038094b';

if (!ObjectId.isValid(id)) {
  console.log('ID not valid')
}


Todo.find({
  _id: id
}).then((todos) => {
  console.log('todos', todos);
})

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('todo', todo);
})

Todo.findById(id).then((todo) => {
  if (!todo) {return console.log('id not found')}
  console.log('todo by id', todo);
}).catch((err) => console.log(err));
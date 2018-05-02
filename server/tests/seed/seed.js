const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'anna@trollo.pl',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
  },
  {
  _id: userTwoId,
  email: 'nieanna@trollo.pl',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

let dummyTodos = [
  {text: 'first test todo',
  _id: new ObjectID(),
  _creator: userOneId},
  {text: 'second todo',
  _id: new ObjectID(),
  completed: true, 
  completedAt: 333,
  _creator: userTwoId}
];

const populateTodos = (done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(dummyTodos);
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => {done()})
}

module.exports = {
  dummyTodos,
  populateTodos,
  populateUsers,
  users
}
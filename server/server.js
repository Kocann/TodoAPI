require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => { res.send({todos}) },
                   (e) => {res.status(400).send(e)});
})

app.get('/todos/:id', (req, res) => {
  let todoId = req.params.id;
  if (!ObjectID.isValid(todoId)) {
    res.sendStatus(404).send()
  }
  Todo.findById(todoId).then(
    (todo) => {
      if (!todo) {
        res.sendStatus(404);
      }
      res.send({todo});
    },
    (err) => {
      res.sendStatus(400).send();
    })
    .catch((e) => {console.log(e)});
})

app.delete('/todos/:id', (req, res) => {
  let todoId = req.params.id;

  if (!ObjectID.isValid(todoId)) {
    res.sendStatus(404).send()
  }

  Todo.findByIdAndRemove(todoId).then((removedTodo) => {
    if (!removedTodo) {
      res.sendStatus(404);
    }
    res.send({removedTodo});
  },
  (err) => {
    res.sendStatus(400).send();
  })
  .catch((e) => {console.log(e)});
  
})

app.patch('/todos/:id', (req, res) => {
  let todoId = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(todoId)) {
    res.sendStatus(404).send()
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(todoId,
  { $set: body },
  { new: true }
  ).then((todo) => {
    if (!todo) {
      res.sendStatus(404).send();
    }
    res.send({todo});
  })
  .catch((e) => {console.log(e)});
})
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`'listening on port ${port}`);
})

module.exports = {app};
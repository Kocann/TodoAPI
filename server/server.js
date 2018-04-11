var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

var app = express();
const port = process.env.PORT || 3000;
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

app.listen(port, () => {
  console.log(`'listening on port ${port}`);
})

module.exports = {app};
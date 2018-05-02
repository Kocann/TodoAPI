require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => { res.send({todos}) },
                   (e) => {res.status(400).send(e)});
})

app.get('/todos/:id', authenticate, (req, res) => {
  let todoId = req.params.id;
  if (!ObjectID.isValid(todoId)) {
    res.sendStatus(404).send()
  }
  Todo.findOne({
    _id: todoId,
    _creator: req.user._id
  }).then(
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

app.delete('/todos/:id', authenticate, (req, res) => {
  let todoId = req.params.id;

  if (!ObjectID.isValid(todoId)) {
    res.sendStatus(404).send()
  }

  Todo.findOneAndRemove({_id: todoId, _creator: req.user._id}).then((removedTodo) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
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
  Todo.findOneAndUpdate({_id: todoId, _creator: req.user._id},
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

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  let user = new User(body)

  user.save().then(
    () => {
      return user.generateAuthToken();
    },
    (err) => {
      res.sendStatus(400).send(err);
    }
  ).then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch(e => res.sendStatus(400).send(err))
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['password', 'email']);

 User.findByCredentials(body.email, body.password)
  .then(user => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user); 
    })
  })
  .catch(e => res.sendStatus(404).send(e))
});

app.delete('/users/me/token', authenticate, (req, res) => {
  let user = req.user;

  user.removeToken(req.token).then(
    () => {res.sendStatus(200).send()},
    () => {res.sendStatus(400).send()}
  )
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`'listening on port ${port}`);
})

module.exports = {app};
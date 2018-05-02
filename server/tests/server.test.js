const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/users');

const {dummyTodos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
//clear all database before each test
// do this ony when testing db connection
// NOT ON REAL DATABASES!!!! JUST TEST DBS
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo text';

    request(app) // from supertest
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {return done(err);}

        Todo.find({text})
            .then((todos) => {
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text)
              done();
            })
            .catch((err) => {
              done(e);
            })
      })
  })

  it('should NOT create a new todo with invalid body data', (done) => {
    var text = {};

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {return done(err);}

        Todo.find()
            .then((todos) => {
              expect(todos.length).toBe(2);
              done();
            })
            .catch((err) => {
              done(e);
            })
      })
  })
});

describe('GET /todos', () => {
  it('should NOT create a new todo with invalid body data', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
    })
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });
});

describe('GET /todos/:id', () => {
  it('should get todo doc with specific id', (done) => {
    request(app) // from supertest
    .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(dummyTodos[0].text);
    })
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });

  it('should NOT get todo doc with specific id when todo is sommeone elses', (done) => {
    request(app) // from supertest
    .get(`/todos/${dummyTodos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });

  it('should return 404 if todo not found', (done) => {
    request(app) // from supertest
    .get(`/todos/${(new ObjectID()).toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });

  it('should return 404 for non-object ids', (done) => {
    request(app) // from supertest
    .get(`/todos/123`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });
});

describe('DELETE todos/:id', () => {
  it('should delete todo with given id, and return it', (done) => {
    request(app)
      .delete(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.removedTodo.text).toBe(dummyTodos[0].text)
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should NOT delete todo of other user with given id, and return it', (done) => {
    request(app)
      .delete(`/todos/${dummyTodos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should return 404 for not found id', (done) => {
    request(app)
      .delete(`/todos/${(new ObjectID()).toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should return 404 for non-id objects', (done) => {
    request(app)
      .delete('/todos/124')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo to be completed', (done) => {
    request(app)
      .patch(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: 'trolo'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(typeof(res.body.todo.completedAt)).toBe('number')
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should NOT update the todo of other user to be completed', (done) => {
    request(app)
      .patch(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text: 'trolo'
      })
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should update the todo to be uncompleted', (done) => {
    request(app)
      .patch(`/todos/${dummyTodos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text: 'trolo'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })
})

describe('GET /users/me', () => {
  it('should return authenticated user', (done) => {
    request(app)
      .get(`/users/me`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should return authenticated user', (done) => {
    request(app)
      .get(`/users/me`)
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })
})

describe('POST /users', () => {
  it('should create user', (done) => {
    request(app)
      .post(`/users`)
      .send({
        email: 'testemail@wp.pl',
        password: 'testpassword'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe('testemail@wp.pl');
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
      
  })

  it('should return validaion error if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'wrongEmmal',
        password: 'pass'
      })
      .expect(400)
      .end(done)
  })

  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'nieanna@trollo.pl',
        password: 'pass'
      })
      .expect(400)
      .end(done)
  })
})

describe('POST /users/login', () => {
  it('should login user and return token', (done) => {
    request(app)
      .post(`/users/login`)
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {return done(err)}

        User.findById(users[0]._id).then(user => {
          expect(user.tokens[1]).toHaveProperty(
            'token', res.headers['x-auth']
          );
          done()
        })
        .catch(e => done(e));
      })
  })

  it('should not login user and not have token', (done) => {
    request(app)
      .post(`/users/login`)
      .send({
        email: users[0].email,
        password: 'sssss'
      })
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err)}

        User.findById(users[0]._id).then(user => {
          expect(user.tokens.length).toBe(1);
          done()
        })
        .catch(e => done(e));
      })
  })
})

describe('DELETE /users/me/toke', () => {
  it('should delete token from tokens array', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res)=> {
        if (err) {return err}

        User.findById(users[0]._id).then(
          (user) => {
            expect(user.tokens.length).toBe(0);
            done();
          },
          (err) => res.sendStatus(400))

      });
  })
})
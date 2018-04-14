const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

let dummyTodos = [
  {text: 'first test todo',
  _id: new ObjectID()},
  {text: 'second todo',
  _id: new ObjectID(),
  completed: true, 
  completedAt: 333}
];

//clear all database before each test
// do this ony when testing db connection
// NOT ON REAL DATABASES!!!! JUST TEST DBS
beforeEach((done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(dummyTodos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo text';

    request(app) // from supertest
      .post('/todos')
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
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
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
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(dummyTodos[0].text);
    })
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });

  it('should return 404 if todo not found', (done) => {
    request(app) // from supertest
    .get(`/todos/${(new ObjectID()).toHexString()}`)
    .expect(404)
    .end((err, res) => {
      if (err) {return done(err);}
      done();
    });
  });

  it('should return 404 for non-object ids', (done) => {
    request(app) // from supertest
    .get(`/todos/123`)
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
      .expect(200)
      .expect((res) => {
        expect(res.body.removedTodo.text).toBe(dummyTodos[0].text)
      })
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should return 404 for not found id', (done) => {
    request(app)
      .delete(`/todos/${(new ObjectID()).toHexString()}`)
      .expect(404)
      .end((err, res) => {
        if (err) {return done(err)}
        done();
      })
  })

  it('should return 404 for non-id objects', (done) => {
    request(app)
      .delete('/todos/124')
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

  it('should update the todo to be uncompleted', (done) => {
    request(app)
      .patch(`/todos/${dummyTodos[1]._id.toHexString()}`)
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
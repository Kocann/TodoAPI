const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

//clear all database before each test
// do this ony when testing db connection
// NOT ON REAL DATABASES!!!! JUST TEST DBS
beforeEach((done) => {
  Todo.remove({}).then(()=>done());
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

        Todo.find()
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
              expect(todos.length).toBe(0);
              done();
            })
            .catch((err) => {
              done(e);
            })
      })
  })
});
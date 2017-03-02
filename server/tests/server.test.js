const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

// const todos = [{
//   _id: new ObjectID(),
//   text: 'First test todo'
// }, {
//   _id: new ObjectID(),
//   text: 'Second test todo',
//   completed: true,
//   completedAt: 333
// }];

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      })
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);

  });
});

describe('GET /todos/:id', () => {
  it('should get todo doc by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should get 404 if not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should get 404 if not an object id', (done) => {
    request(app)
      .get('/todos/12345')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete by id', (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        // Todo.find().then((todos) => {
        //   expect(todos).toNotExist()
        //     .expect(todos.length).toBe(1)
        //     .done();
        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err));

      });
  });

  it('should get 404 if not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should get 404 if not an object id', () => {
    request(app)
      .delete('/todos/12345')
      .expect(404);
  });
});


describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    var id = todos[0]._id.toHexString();
    var text = 'Updated from test'
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBeA('number');
      }).end(done);
  });

  it('should remove completedAt when todo is not completed', (done) => {
    var id = todos[1]._id.toHexString();
    var text = 'Clearing completedAt';
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toNotExist();
      }).end(done);
  });
});

describe('GET /users/me', () => {
  it('should get my user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    var email = 'test@gmail.com';
    var password = '123456!';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      }).end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          expect(user.email).toBe(email);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return validation errors if request is invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'thisisnotanemail', password: '123'})
      .expect(400)
      .end(done);
  });

  it('should not create a duplicate user', (done) => {
    var email = users[0].email;

    request(app)
      .post('/users')
      .send({email: users[0].email, password: '1234567!'})
      .expect(400)
      .end(done);
  });
})

describe('POST /users/login', () => {
  it('should login user and return x-auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      }).end((err, res) => {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({users: users[1].email, password: users[1].password + 'blep'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      }).end((err, res) => {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) =>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});

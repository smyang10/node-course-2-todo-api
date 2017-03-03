require('./config/config');


const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  }).save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  })
});

// GET /todos/id
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  // if invalid Id, send back 404
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // findbyid, success -> send back todo, or send back 404, error -> 404 empty body
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(404).send();
  });
});


app.delete('/todos/:id', authenticate, (req, res) => {
  // get the id
  var id = req.params.id;

  // validate the id
  //  if not valid, send 404
  if(!ObjectID.isValid(id)){
    // console.log('todo id not valid');
    return res.status(404).send();
  }
  // console.log('todo id is valid');
  // remove todo by id
  //  error, send 404
  //  success -> check doc came back. if no doc, send 404
  //              otherwise, send doc
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
      // console.log('Todo not found');
      return res.status(404).send();
    }
    // console.log('Sending back todo');
    res.status(200).send({todo});
  }).catch((err) => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => res.send(400).send());
});

// Create user
app.post('/users', (req, res) => {
  // console.log(req.body);
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);


  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    if(err.code == 11000){
      res.status(400).send(`User ${user.email} already exists!`);
    } else {
      res.status(400).send(err);
    }
  });
});

// Login user
app.post('/users/login', (req, res) => {
  var login = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(login.email, login.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((err) => {
    res.status(400).send();
  });

  // User.findOne({email: login.email}).then((user, err) => {
  //   if(!user){
  //     return res.status(400).send(err);
  //   }
  //   bcrypt.compare(login.password, user.password).then((result) => {
  //     if(result){
  //       return res.send({user});
  //     }
  //     res.status(400).send();
  //   });
  //
  // }).catch((err) => {
  //   res.status(400).send(err);
  // });

});

// var authenticate = (req, res, next) => {
//   console.log('in authenticate');
//   var token = req.header('x-auth');
//
//   User.findByToken(token).then((user) => {
//     if(!user){
//       return Promise.reject();
//     }
//
//     req.user = user;
//     req.token = token;
//     next();
//   }).catch((err) => {
//     res.status(401).send();
//   });
// };


app.get('/users/me', authenticate, (req, res) => {

  res.send(req.user);
  // var token = req.header('x-auth');
  //
  // User.findByToken(token).then((user) => {
  //   if(!user){
  //     return Promise.reject();
  //   }
  //
  //   res.send({user});
  // }).catch((err) => {
  //   res.status(401).send();
  // });
});
app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
})


app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});
module.exports = {app};

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT  || 3000;

app.use(bodyParser.json());
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  }).save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  })
});

// GET /todos/id
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // if invalid Id, send back 404
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  // findbyid, success -> send back todo, or send back 404, error -> 404 empty body
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(404).send();
  });
});


app.delete('/todos/:id', (req, res) => {
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
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      // console.log('Todo not found');
      return res.status(404).send();
    }
    // console.log('Sending back todo');
    res.status(200).send({todo});
  }).catch((err) => res.status(400).send());


});

app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
})

module.exports = {app};

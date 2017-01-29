//const MongoClient = require('mongodb').MongoClient;

// Destructured object - ES6 only
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp').then((db) => {
  console.log('Connected to MongoDB server.');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('588d1c202813d954fbcf6bbb')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //     returnOriginal: true
  //   }).then((res) => {
  //   console.log(res);
  // });

  // CHALLENGE!!!!
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('588d0a0377668e4487a6be18')
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: 'Kobe Bryant'
    }
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(res);
  }, (err) => {
    console.log('Unable to update Users', err);
  });
  //db.close();
});

//const MongoClient = require('mongodb').MongoClient;

// Destructured object - ES6 only
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp').then((db) => {
  console.log('Connected to MongoDB server.');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // CHALLENGE!!!
  db.collection('Users').deleteMany({name: 'Chyea Blep'}).then((res) => {
    console.log(res);
  });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('588d087465360c44303b53b4')
  }).then((res) => {
    console.log(res);
  })

  //db.close();

}).catch((err) => {
  return console.log('Unable to connect to MongoDB server!');
});

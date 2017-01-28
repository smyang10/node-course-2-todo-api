//const MongoClient = require('mongodb').MongoClient;

// Destructured object - ES6 only
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp').then((db) => {
  console.log('Connected to MongoDB server.');

  // db.collection('Todos').find({
  //   _id: new ObjectID('588d0e8e2813d954fbcf68e9')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }).catch((err) => {
  //   console.log('Unable to fetch todos!');
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }).catch((err) => {
  //   console.log('Unable to fetch todos!');
  // });

  // CHALLENGE!!!

  db.collection('Users').find({name: 'Kobe'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }).catch((err) => {
    console.log('Unable to fetch users!', err);
  });

  db.collection('Users').find({name: 'Chyea Blep'}).toArray().then((docs => {
    console.log(JSON.stringify(docs, undefined, 2));
  }), (err) => {
    console.log('Unable to fetch users!', err);
  })

  //db.close();

}).catch((err) => {
  return console.log('Unable to connect to MongoDB server!');
});

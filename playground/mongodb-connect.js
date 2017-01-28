//const MongoClient = require('mongodb').MongoClient;

// Destructured object - ES6 only
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp').then((db) => {
  console.log('Connected to MongoDB server.');

  db.collection('Users').insertOne({
    name: 'Chyea Blep',
    age: 25,
    location: 'Los Angeles, CA'
  }).then((res) => {
    console.log(JSON.stringify(res.ops, undefined, 2));
    console.log(res.ops[0]._id.getTimestamp());
  }).catch((err) => {
    return console.log('Unable to insert user', err);
  })
  db.close();
}).catch((err) => {
  return console.log('Unable to connect to MongoDB server!');
});

 // **Old callback method here**
 // (err, db) => {
 //  if(err) {
 //    return console.log('Unable to connect to MongoDB server!');
 //  }
 //  console.log('Connected to MongoDB server.');

  // insertOne takes 2 args: object being inserted, and callback
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, res) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // })

  // Insert Users doc with name, age, location

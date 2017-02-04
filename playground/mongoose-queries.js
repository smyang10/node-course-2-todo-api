const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');
// var id = '58962ce6d06315581bb444661';

var id = '589631243fcc6334a9d96b82';


// CHALLENGE!!!

if(ObjectID.isValid(id)){
  User.findById(id).then((user) => {
    if(!user){
      return console.log('No user by that id');
    }
    console.log(JSON.stringify(user, undefined, 2));
  }).catch((err) => console.log(err));
}
else{
  console.log('Id not valid');
}




// if(!ObjectID.isValid(id)){
//   console.log('id not valid');
// };

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

//
// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('id not found');
//   }
//   console.log('Todo', todo);
// }).catch((e) => console.log(e));

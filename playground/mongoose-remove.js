const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//
// Todo.remove({}).then((res) => {
//   console.log(res);
// })


//Todo.findOneAndRemove()
Todo.findOneAndRemove({_id: '5896bb1df0beb8713ae4b4f0'}).then((todo) => {

});

//Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5896bb1df0beb8713ae4b4f0').then((todo) => {
  console.log(todo);
});

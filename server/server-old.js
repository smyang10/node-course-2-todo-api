var {mongoose} = require('./db/mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

// var newTodo = new Todo({
//   text: 'Cook dinner',
// });
//
// newTodo.save().then((res) => {
//   console.log('Saved todo', res);
// }, (err) => {
//   console.log('Unable to save Todo');
// });

// CHALLENGE!!!!
// var challenge = new Todo({
//   text: '     blep',
//   // completed: true,
//   // completedAt: 12112312412123
// }).save().then((res) => {
//   console.log('Saved todo', JSON.stringify(res, undefined, 2));
// }, (err) => {
//   console.log(err);
// });


// CHALLENGE 2
var challenge2 = new User({
  email: 'smyang10@gmail.com'
}).save().then((res) => {
  console.log(JSON.stringify(res, undefined, 2));
}, (err) => {
  console.log(err);
})

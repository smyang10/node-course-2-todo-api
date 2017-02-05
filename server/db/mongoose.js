var mongoose = require('mongoose');

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://todoadmin:todoadmin@ds111589.mlab.com:11589/todoapp'
};

mongoose.Promise = global.Promise;
mongoose.connect( db.mlab || db.localhost);

module.exports = {mongoose};

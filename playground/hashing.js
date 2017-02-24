const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var pw = '123abc!';
var hashed;
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(pw, salt, (err, hash) => {
    console.log(hash);
  });
});
var hashed = '$2a$10$6XadvLeaXzTga2XI8kehQOn7FyFYuiYAGHwMY8LePAQTldiXvFLGq';

bcrypt.compare(pw, hashed, (err, res) => {
  console.log(res);
});
// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');
//
// console.log(token);
//
//
// var decoded = jwt.verify(token, '123abcc');
//
// console.log('decoded', decoded);
// var msg = 'I am user 3';
// var hash = SHA256(msg).toString();
//
// console.log(`the message is ${msg}`);
// console.log(`the hash is ${hash}`);
//
// var data = {
//   id: 4
// };
//
//
//
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// } else {
//   console.log('data was changed, do not trust');
// }

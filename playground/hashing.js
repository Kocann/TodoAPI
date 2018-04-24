const {SHA256} =  require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  });
})

var hashedPass = '$2a$10$BoS1Rle2ZwEeflpHvDeF4.uqIW55NmODw3TZA9hz/q/q.gVrzA1PW';

bcrypt.compare(password, hashedPass, (err, result) => {
  console.log(result)
});

////////////////////////////////////////////////////////////////

// var data = {
//   id: 10
// }

// var token = jwt.sign(data, '123abc');

// var decoded = jwt.verify(token, '123abc');

// var message = 'I am user nr 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`)
// console.log(`hash: ${hash}`)


////////////////////////////////////////////////////////////////
// var data = {
//   id: 4 
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('data not changed')
// } else {
//   console.log('data changed, dont trust')
// }
const readline = require('readline');
const Database = require('../src/db.js');
const User = require('../src/models/user.js');
const JSONWebToken = require('../src/models/jsonwebtoken.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Please enter your email (mandatory): ', (email) => {
  console.log(`email address: ${email}`);
  Database.open();

  let user = Database.getUser(email);
  user.then(function(result) {
    if (typeof result === 'undefined') {
      rl.question('Please enter your password: ', (password) => {
        rl.question('Please enter a name : ', (name) => {
          rl.close();
          User.generate(email, password, name).then(function(newuser) {
            user = newuser;
            return Database.createUser(newuser);
          }).then(function(id) {
            user.id = id;
            console.log(user);
            const sig = JSONWebToken.issueToken(user.id);
            sig.then(function(result) {
              console.log('JWT token signature is:', result);
            });
          });
        });
      });
    } else {
      rl.close();
      console.log(user);
      const sig = JSONWebToken.issueToken(user.id);
      sig.then(function(result) {
        console.log('JWT token signature is:', result);
      });
    }
  });
});

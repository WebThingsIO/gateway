const readline = require('readline');
const Database = require('../build/db').default;
const User = require('../build/models/user').default;
const JSONWebToken = require('../build/models/jsonwebtoken').default;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Please enter your email (mandatory): ', (email) => {
  console.log(`email address: ${email}`);
  Database.open();

  let user = Database.getUser(email);
  user.then((result) => {
    if (typeof result === 'undefined') {
      rl.question('Please enter your password: ', (password) => {
        rl.question('Please enter a name : ', (name) => {
          rl.close();
          User.generate(email, password, name).then((newuser) => {
            user = newuser;
            return Database.createUser(newuser);
          }).then((id) => {
            user.id = id;
            console.log(user);
            const sig = JSONWebToken.issueToken(user.id);
            sig.then((result) => {
              console.log('JWT token signature is:', result);
            });
          });
        });
      });
    } else {
      rl.close();
      console.log(user);
      const sig = JSONWebToken.issueToken(user.id);
      sig.then((result) => {
        console.log('JWT token signature is:', result);
      });
    }
  });
});

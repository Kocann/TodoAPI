const {User} = require('./../models/users');

var authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then(user => {
    if (!user) {
      return new Promise((resolve, reject) => {
        reject();
      })
    }
    req.user = user;
    req.token = token;
    next();
  }, 
  (e) => {
    res.sendStatus(401).send();
  }).catch(e => res.sendStatus(400).send(err))
};

module.exports = {
  authenticate
}
const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');
const mail = require('../handlers/mail');
const crypto = require('crypto');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.SECRET);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), _id: req.user._id });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // Repond to request indicating the user was created
      res.json({ token: tokenForUser(user), _id: user._id });
    });
  });
};

exports.forgot = (req, res) => {
  // See if a user exists with that email
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(400).json({error: 'No account with that email exists'})
        return;
      }
      // Set reset tokens and expiration on their account
      user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now'
      user.save()
        .then(user => {
          const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
          mail.send({
            user,
            subject: 'Password Reset',
            resetURL,
            filename: 'password-reset'
          }, (err, info) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ message: 'You have been emailed a password reset link.'});
          });
        });
    })
    .catch(err => {
      res.status(400).json(err);
      return;
    });
  };

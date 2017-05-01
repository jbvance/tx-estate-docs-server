const User = require('../models/user');

exports.signup = function (req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error: 'You must provide email and password'});
  }

  //See if a user with the given email exists
  User.findOne({email: email}, (err, existingUser) => {
    if (err) { return next(err);}

    // If a user does exist, return an error

    if (existingUser) {
      //http status code 422 is unprocessable entity
      return res.status(422).send({ error: 'EMail is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })
    user.save((err) => {
      if (err) { return next(err); }
    }); //Must call save to save record to database

      //Respond to request indicating user was created
      res.json({sucess: true});

  }); //end of callback function

};

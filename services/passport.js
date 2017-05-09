const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

var env = process.env.NODE_ENV || "development";
// Set config variables for development
if (env === "development"){
  console.log("LOADING DEV ENV CONFIG");
  require('dotenv').config();
}


// Create local Strategy
// Passport uses 'username' and 'password' by default when it looks in the
// request body, so let it know we are using email instead of username
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this user email and password, call done with the correct
  // email and password; otherwise, call done with false
  User.findOne({ email: email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false) }

    //Compare passwords - is 'password' equal to user.password
    user.comparePassword(password, function(err, isMatch) {
     if (err) { return done(err); }
     if (!isMatch) { return done(null, false); }

      //If we get here, the passwords matched
      // Now, call the Passport callback. Passport takes 'user' below
      // and assigns it to req.user so we can use it to authenticate in
      // authentication controller
      return done(null, user);
    });

  });

});

//Set up options for JWT strategy
//console.log( "SECRET", process.env.SECRET);
const jwtOptions = {
  //look for a header called 'authorization' to find the token
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if user ID in the payload exists in the database
  // If it does, call done with that user; otherwise,
  // call done wihout a user object
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      //no error, but return false
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

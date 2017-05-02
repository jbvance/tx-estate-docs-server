const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//Set up options for JWT strategy
const jwtOptions = {
  //look for a header called 'authorization' to find the token
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
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

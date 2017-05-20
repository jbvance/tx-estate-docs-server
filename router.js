const Authentication = require ('./controllers/authentication');
const UserProfile = require('./controllers/user_profile');
const  passportService = require('./services/passport');
const passport = require('passport');

//session is set to false because passport by default tries to create
//a cookie-based session, and we don't want that.
const requireAuth = passport.authenticate('jwt', {session: false });
const requireSignin = passport.authenticate('local', {session: false });

module.exports = (app) =>  {
  app.get('/', requireAuth, function(req, res) {
    res.send({message: 'Super secret code is ABC123'});
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);

  app.post('/profile', requireAuth, UserProfile.createOrEditProfile);
  app.post('/profile/:id', requireAuth, UserProfile.createOrEditProfile);
};

const Authentication = require ('./controllers/authentication');
const UserProfile = require('./controllers/user_profile');
const Dpoa = require('./controllers/dpoaController');
const Mpoa = require('./controllers/mpoaController');
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

  //Profile Routes
  app.post('/profile', requireAuth, UserProfile.createOrEditProfile);
  app.get('/profile', requireAuth, UserProfile.getProfile);
  app.post('/profile/:id', requireAuth, UserProfile.createOrEditProfile);

  // Durable Power of Attorney Routes
  app.post('/dpoa', requireAuth, Dpoa.createOrUpdateDpoa);
  app.get('/dpoa', requireAuth, Dpoa.getDpoa);

  // Medical Power of Attorney Routes
  app.post('/mpoa', requireAuth, Mpoa.createOrUpdateMpoa);
  app.get('/mpoa', requireAuth, Mpoa.getMpoa);

  // Forgot password
  app.post('/forgot', Authentication.forgot);
};

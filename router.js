const Authentication = require ('./controllers/authentication');
const  passportService = require('./services/passport');
const passport = require('passport');

//session is set to false because passport by default tries to create
//a cookie-based session, and we don't want that.
const requireAuth = passport.authenticate('jwt', {session: false });

module.exports = (app) =>  {
  app.get('/', requireAuth, function(req, res) {
    res.send({hi: 'there'});
  });
  app.post('/signup', Authentication.signup);
};

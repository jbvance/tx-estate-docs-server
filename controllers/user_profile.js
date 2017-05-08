
const UserProfile = require('../models/user_profile');

exports.createProfile = function(req, res, next) {
  console.log("GOT HERE")
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;

  if (!firstName || !lastName || !address || !city || !state || !zip) {
    return res.status(422).send({ error: 'You must provide all required fields'});
  }

  // See if a user with the given email exists
  UserProfile.findOne({ _id: '5909fd6875197132947df6eb' }, function(err, existingUser) {
    //if (err) { return next(err); }

    // If user does not exist, return an error
    //if (!existingUser) {
      //return res.status(422).send({ error: 'No user could be found' });
  //  }

    // If a user with email does NOT exist, create and save user record
    const userProfile = new UserProfile({
      firstName,
      lastName,
      middleName: middleName || '',
      address,
      city,
      state,
      zip
    });

    userProfile.save(function(err) {
      if (err) { return next(err); }

      // Repond to request indicating the user was created
      res.json({ userProfile: userProfile });
    });
  });
}

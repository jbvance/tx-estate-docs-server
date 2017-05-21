const UserProfile = require('../models/user_profile');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createOrEditProfile = function(req, res, next) {
  console.log("PROFILE_PROPS", req.body);
  const { firstName, lastName, middleName, address, city,
    state_residence, zip } = req.body;
  const owner = req.params.id;
  console.log("OWNER", owner);

  if (!firstName || !lastName || !address || !city || !state_residence || !zip || !owner) {
    return res.status(422).send({ error: 'You must provide all required fields'});
  }

  // See if a user with the given email exists
  const userProfile = UserProfile.findOne({ owner: new ObjectId(owner) }, function(err, existingUser) {
    if (err) { return next(err); }

     // If user does not yet have a profile, create a new profile
    if (!existingUser) {
      //return res.status(422).send({ error: 'No user could be found' });
      // If we get here, user does not yet have a profile, so create a new one
      console.log("CREATING NEW PROFILE");
      const newUser = new UserProfile({
        firstName,
        lastName,
        middleName: middleName || '',
        address,
        city,
        state_residence,
        zip,
        owner
      });
      newUser.save(function(err) {
        if (err) {
          return next(err);
        }

        // Repond to request indicating the user was created
        console.log("New User Profile Created!");
        return res.json({ newUser, message: 'New User Profile created!' });
      });
    } else {

    // If we get here, save the existing profile
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.middleName = middleName || '';
    existingUser.address = address
    existingUser.city = city;
    existingUser.state_residence = state_residence;
    existingUser.zip = zip;
    existingUser.owner = owner;

    existingUser.save(function(err) {
      if (err) { return next(err); }

      // Repond to request indicating the user was created
      console.log("USER PROFILE UPDATED");
      return res.json({ message: 'User profile updated!' });
    });

    }

  });
};

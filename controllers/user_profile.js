
const UserProfile = require('../models/user_profile');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createOrEditProfile = function(req, res, next) {
  console.log("PROFILE_PROPS", req.body);
  console.log("USER", req.user);
  const { firstName, lastName, middleName, address, city,
    state_residence, zip } = req.body;
  const owner = req.params.id;
  console.log("OWNER", owner);

  if (!firstName || !lastName || !address || !city || !state_residence || !zip || !owner) {
    return res.status(422).send({ error: 'You must provide all required fields'});
  }

  // See if a user with the given email exists
   User.findOne({ _id: req.user._id }, function(err, user) {
   if (err) { return next(err); }

    // Save the profile
    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    user.profile.middleName = middleName || '';
    user.profile.address = address;
    user.profile.city = city;
    user.profile.state_residence = state_residence;
    user.profile.zip = zip;
    user.profile.owner = owner;

    user.save(function(err) {
      if (err) { return next(err); }

      // Repond to request indicating the user was created
      console.log("USER PROFILE UPDATED");
      return res.json({ message: 'User profile updated!' });
    });

  });
};

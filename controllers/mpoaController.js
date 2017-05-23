const Mpoa = require('../models/mpoa');
const UserProfile = require('../models/user_profile');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createOrUpdateMpoa = function (req, res, next) {
  const { agents } = req.body;

  UserProfile.findOne({ owner: req.user._id })
    .then(profile => {
      // If profle already has a Mpoa, update the existing one;
      // otherwise, add the new Mpoa
      if (profile.mpoas.length) {
         Mpoa.findByIdAndUpdate(
           profile.mpoas[profile.mpoas.length - 1],
           {
             agents,
           },
           { new: true }
         )
          .then(profileMpoa => {
            res.json(profileMpoa);
            return;
          })
          .catch(err => next(err));

      } else {
          const mpoa = new Mpoa({ agents });
          profile.mpoas.push(mpoa);
          Promise.all([profile.save(), mpoa.save()])
            .then(() => {
              res.json(profile);
              return;
            })
            .catch (err => next (err));
      }

    })
    .catch(err => next(err));
};

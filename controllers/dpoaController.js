const Dpoa = require('../models/dpoa');
const UserProfile = require('../models/user_profile');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createOrUpdateDpoa = function (req, res, next) {
  const { agents, effectiveNow } = req.body;

  UserProfile.findOne({ owner: req.user._id })
    .then(profile => {
      // If profle already has a Dpoa, update the existing one;
      // otherwise, add the new Dpoa
      if (profile.dpoas.length) {
         Dpoa.findByIdAndUpdate(
           profile.dpoas[profile.dpoas.length - 1],
           {
             agents,
             effectiveNow
           },
           { new: true }
         )
          .then(profileDpoa => {
            return res.json(profileDpoa);
          })
          .catch(err => next(err));

      } else {
          const dpoa = new Dpoa({agents, effectiveNow});
          profile.dpoas.push(dpoa);
          Promise.all([profile.save(), dpoa.save()])
            .then(() => {
              console.log("DONE");
              return res.json(profile);
            })
            .catch (err => next (err));
      }

    })
    .catch(err => next(err));
};

exports.getDpoa = function(req, res, next){
  UserProfile.findOne({ owner: req.user._id })
    .populate('dpoas')
    .exec(function(err, existingUser) {
      if (err) { return next(err); }
      if (existingUser) {
          res.json( { dpoa: existingUser.dpoas });
          return;
      } else  {
          res.status(500).send({ message: 'No User Profile Found.'});
          return;
      }
    });
};

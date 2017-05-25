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
          console.log("UPDATING DPOA>>>>>>>>>>>>>>>>>>>>>>");
         Dpoa.findById(profile.dpoas[profile.dpoas.length - 1])
          .then(profileDpoa => {
            profileDpoa.agents = agents;
            profileDpoa.effectiveNow = effectiveNow;
            profileDpoa.validate(function(err) {
              if (err) {
                console.log('*************DPOA VALIDATION FAILED*********', err);
                res.status(422).json({error: err.errors});
                return;
              } else {
                profileDpoa.save()
                  .then (newProfile => {
                    res.status(200).json(newProfile);
                    return;
                  });
              }
            });
          })
          .catch(err => {
            console.log("ERROR OCCURRED IN SAVE>>>>>>>>>>>>>>>>>>>>", err);
            next(err);
          });


      } else {

          const dpoa = new Dpoa({agents, effectiveNow});
          console.log("ADDING NEW DPOA>>>>>>>>>>>>>>>>>>", agents);
          profile.dpoas.push(dpoa);
          dpoa.save()
            .then(() => profile.save())
            .then(() => {
                  res.json(profile);
                  return;
                }
            )
            .catch(err => {
              console.log('ERROR SAVING PROFILE>>>>>>>>>>');
              res.status(422).json({error: err});
              return;
            });
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

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
          console.log("UPDATING MPOA>>>>>>>>>>>>>>>>>>>>>>");
         Mpoa.findById(profile.mpoas[profile.mpoas.length - 1])
          .then(profileMpoa => {
            profileMpoa.agents = agents;
            profileMpoa.save()
              .then(newMpoa => {
                res.status(200).json(newMpoa);
                return;
              })
              .catch(err => {
                console.log('**************MPOA VALIDATION FAILED**************', err);
                res.status(422).json({ error: err.errors });
              });
          })
          .catch(err => {
            console.log("ERROR OCCURRED IN SAVE MPOA>>>>>>>>>>>>>>>>>>>>", err);
            next(err);
          });


      } else {

          const mpoa = new Mpoa({ agents });
          console.log("ADDING NEW MPOA>>>>>>>>>>>>>>>>>>", agents);
          profile.mpoas.push(mpoa);
          mpoa.save()
            .then(() => profile.save())
            .then(() => {
                  res.json(profile);
                  return;
                }
            )
            .catch(err => {
              console.log('ERROR SAVING PROFILE MPOA>>>>>>>>>>');
              res.status(422).json({error: err});
              return;
            });
      }

    })
    .catch(err => next(err));
};


exports.getMpoa = function(req, res, next){
  UserProfile.findOne({ owner: req.user._id })
    .populate('mpoas')
    .exec(function(err, existingUser) {
      if (err) { return next(err); }
      if (existingUser) {
          res.json( { mpoa: existingUser.mpoas });
          return;
      } else  {
          res.status(500).send({ message: 'No User Profile Found.'});
          return;
      }
    });
};

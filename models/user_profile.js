const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//Define the model
const userProfileSchema = new Schema({
  firstName: { type: String, required: 'First Name is required', trim: true },
  lastName: { type: String, required: 'Last Name is required', trim: true },
  middleName: { type: String, trim: true },
  address: {type: String, required: 'Address is required', trim: true },
  city: {type: String, required: 'City is required', trim: true },
  state_residence: {type: String, required: 'State is required', trim: true },
  zip: {type: String, required: 'Zip Code is required', trim: true },
  owner: {
    type: Schema.ObjectId,
    ref: 'user',
    required: 'You must supply an owner for the profile'
  },
  dpoas: [{
    type: Schema.Types.ObjectId,
    ref: 'dpoa'
  }],
  mpoas: [{
    type: Schema.Types.ObjectId,
    ref: 'mpoa'
  }]
});

//On Save Hook, encrypt password
//Before saving a model, urn t his function
userProfileSchema.pre('save', function(next){
  //get access to the user model
  const userProfile = this;

    //Add any necessary pre-save functionality here

      //go ahead and save the user profile
      next();
    });


// Whatever is at userSchema.methods will be available as a method
// when you use userSchema
/* example
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch)=> {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};*/

//Create the model class
const ModelClass = mongoose.model('userProfile', userProfileSchema);


//Export the model
module.exports = ModelClass;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the model
const userProfileSchema = new Schema({
  firstName: { type: String, required: 'First Name is required' },
  lastName: { type: String, required: 'Last Name is required' },
  middleName: { type: String },
  address: {type: String, required: 'Address is required' },
  city: {type: String, required: 'City is required' },
  state: {type: String, required: 'State is required' },
  zip: {type: String, required: 'Zip Code is required' },
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

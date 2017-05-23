const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MpoaSchema = new Schema({
  agents: [{
    fullName: {
      type: String,
      required: 'Agent name is required'
    },
    address: {
      type: String,
      required: 'Agent address is required'
    },
    city: {
      type: String,
      required: 'Agent city is required'
    },
    state_residence: {
      type: String,
      required: 'Agent state is required'
    },
    zip: {
      type: String,
      required: 'Agent zip is required'
    }
  }],
  date: { type: Date, default: Date.now }
});

//Create the model class
const ModelClass = mongoose.model('mpoa', MpoaSchema);


//Export the model
module.exports = ModelClass;

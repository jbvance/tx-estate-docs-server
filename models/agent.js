const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgentSchema = new Schema({
   fullName: {
     type: String,
     required: 'Agent Name is required',
     trim: true
   },
   address: {
     type: String,
     required: 'Agent address is required',
     trim: true
   },
   city: {
     type: String,
     required: 'Agent city is required',
     trim: true
   },
   state_residence: {
     type: String,
     required: 'Agent state is required',
     trim: true
   },
   zip: {
     type: String,
     required: 'Agent zip is required',
     trim: true
   },
   date: { type: Date, default: Date.now }

});

//Create the model class
const ModelClass = mongoose.model('agent', AgentSchema);


//Export the model
module.exports = ModelClass;

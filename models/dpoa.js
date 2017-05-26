const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./agent');
const agentSchema = mongoose.model('agent').schema;
mongoose.Promise = global.Promise;

const DpoaSchema = new Schema({
  agents: [ agentSchema ],
  effectiveNow: {
    type: Boolean,
    required: "Effective Time is required"
  },
  date: { type: Date, default: Date.now }
});

//Create the model class
const ModelClass = mongoose.model('dpoa', DpoaSchema);


//Export the model
module.exports = ModelClass;

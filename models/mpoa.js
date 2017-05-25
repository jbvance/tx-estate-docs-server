const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./agent');
const agentSchema = mongoose.model('agent').schema;

const MpoaSchema = new Schema({
  agents: [ agentSchema ],
  date: { type: Date, default: Date.now }
});

//Create the model class
const ModelClass = mongoose.model('mpoa', MpoaSchema);


//Export the model
module.exports = ModelClass;

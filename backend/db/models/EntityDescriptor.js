var mongoose = require('mongoose');

var entityDescriptorSchema = new mongoose.Schema({
  entityID: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
    unique: true
  },
  certificate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});
 
module.exports =  mongoose.model('EntityDescriptor', entityDescriptorSchema);

  

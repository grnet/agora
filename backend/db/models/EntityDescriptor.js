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
    type: Date
  },
  createdAt: {
    type: Date
  }  
});

entityDescriptorSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
  
module.exports =  mongoose.model('EntityDescriptor', entityDescriptorSchema);

  

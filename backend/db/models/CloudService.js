var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
var cloudServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
    description: {
    type: String,
    required: true
  },
  cloudServiceProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'CloudServiceProvider',
    required: true
  }
});

module.exports = mongoose.model('CloudService', cloudServiceSchema);

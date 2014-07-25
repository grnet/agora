var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
var cloudServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }  
});

  
module.exports =
  mongoose.model('CloudServiceProvider', cloudServiceProviderSchema);

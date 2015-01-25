var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
var cloudServiceProviderSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: Buffer,
    required: false
  },
  _country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }  
});

  
module.exports =
  mongoose.model('CloudServiceProvider', cloudServiceProviderSchema);

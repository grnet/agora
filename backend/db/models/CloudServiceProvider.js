var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
var cloudServiceProviderSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  registeredName: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
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

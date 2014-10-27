var mongoose = require('mongoose');

var idpSchema = new mongoose.Schema({  
  entityId: {
    type: String,
    required: true,
    unique: true
  },
  entryPoint: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports =  mongoose.model('Idp', idpSchema);

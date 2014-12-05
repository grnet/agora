var mongoose = require('mongoose');

var countrySchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports =  mongoose.model('Country', countrySchema);

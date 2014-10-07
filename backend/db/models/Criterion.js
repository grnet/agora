var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CriterionSchema = new Schema({
  name:  {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  description: String,
  tags: Array
  }, {
    collection: 'criteria'
  });
  
module.exports = mongoose.model('Criterion', CriterionSchema);

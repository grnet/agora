var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CriterionSchema = new Schema({
  name: String,
  label: String,
  rating: Number,
  tags: Array,
  required: Boolean
});

var CloudServiceSchema = new Schema({
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
  },
  createdAt: {
    type: Date,
    required: true
    },
  modifiedAt: {
    type: Date,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  criteria: [CriterionSchema]
});

CloudServiceSchema.pre('validate', function(next) {
  var saveDate = new Date;
  if (!this.createdAt) {
    this.createdAt = saveDate;
  }
  this.modifiedAt = saveDate;
  next();
});
  
module.exports = mongoose.model('CloudService', CloudServiceSchema);

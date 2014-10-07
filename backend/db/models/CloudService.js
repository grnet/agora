var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
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
  _cloudServiceProvider: {
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
  ratings: [{
    _criterion: {
      type: Schema.Types.ObjectId,
      ref: 'Criterion',
      required: true
    },
    mark: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    }
  }]
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

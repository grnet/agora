var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Criterion = require('./Criterion');
  
var async = require('async');
  
var criteria = [
  "intellectualPropertyRights",
  "processingData",
  "ownership",
  "dataProtection",
  "requestsForDataAccessFrom3rdParties",
  "notification",
  "liquidatedDamages",
  "externalSecurityAuditCertificate",
  "concordanceWithNationalPrivacyActs",
  "securityOfTheCloudService",
  "managingSecurityIncidents",
  "dataBackupAndRestore",
  "compatibility",
  "portability",
  "supervision",
  "electronicDataProcessing",
  "networkConnectivity",
  "aai",
  "userProvisioning",
  "protectionOfMinorsAsUsers",
  "subcontractors",
  "serviceLevelAgreement",
  "qualityReview",
  "informationPerformance",
  "reportingMeteringSalesEstimates",
  "billing",
  "governingLaw",
  "peeringConnectivityCosts"
];

function rateService(service, cbk) {

  async.eachSeries(criteria, function(criterionName, callback) {
    Criterion.findOne({name: criterionName}, function(err, criterion) {
        var msg = "";
        if (err) {
          console.log(err);
          callback(err);
        } else if (!criterion) {
          msg = 'Not found: ' + criteria[i];
          console.log(msg);
          callback(msg);
        } else {
          service.ratings.push({
            _criterion: criterion._id,
            value: 1
          });
          callback();
        }
    });
  },
  function(err) {
    if (err) {
      console.log('Failed to rate all criteria');
      cbk(err);
    } else {
      cbk();
    }  
  });
}
  
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
  processingStatus: {
    type: Number,
    required: true
  },
  countries: [ {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  }],
  ratings: [{
    _criterion: {
      type: Schema.Types.ObjectId,
      ref: 'Criterion',
      required: true
    },
    value: {
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

  if (!this.ratings || this.ratings.length == 0) {
    rateService(this, function(err) {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  } else {
    next();
  }
});
  
module.exports = mongoose.model('CloudService', CloudServiceSchema);

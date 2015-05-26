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
  longDescription: {
    type: String,
    required: false
  },
  logo: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  telephone: {
    type: String,
    required: false
  },
  contactPerson: {
    type: String,
    required: false
  },
  contactEmail: {
    type: String,
    required: false
  },
  _cloudServiceProvider: {
    type: Schema.Types.ObjectId,
    ref: 'CloudServiceProvider',
    required: true,
    index: true
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
  ratingsDate: {
    type: Date,
    required: false
  },
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

function lenVal(len) {
  return function(val) {
    if (val) {
      return val.length <= len;
    }
    else {
      return true;
    };
  };
}

CloudServiceSchema.path('name').validate(lenVal(50),
  'String too long.');

CloudServiceSchema.path('description').validate(lenVal(500),
  'String too long.');
  
CloudServiceSchema.path('longDescription').validate(lenVal(10000),
  'String too long.');

CloudServiceSchema.path('contactPerson').validate(lenVal(30),
  'String too long.');

CloudServiceSchema.path('telephone').validate(lenVal(20),
  'String too long.');
  
CloudServiceSchema.path('contactEmail').validate(lenVal(40),
  'String too long.');  
  
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

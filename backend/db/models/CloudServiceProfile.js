var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
var schemaSkeleton = {
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
  cloudServiceId: {
    type: Schema.Types.ObjectId,
    ref: 'CloudService',
    required: true
  }
};  

var criteria = [
  "intellectualPropertyRights",
  "csp",
  "ownership",
  "nationalLawGovernance",
  "concordanceNationalPrivacyActs",
  "externalSecurityAuditCertificate",
  "subcontractors",
  "protectionMinorsUsers",
  "serviceLevelAgreement",
  "csSecurity",
  "securityIncidentsHandling",
  "dataBackupRestore",
  "compatibility",
  "dataProtection",
  "personnel",
  "penalty",
  "supervision",
  "dataAvailability",
  "edpAudit",
  "qualityReview",
  "notification",
  "billing",
  "aai",
  "userProvisioning",
  "reportingMeteringSalesEstimates",
  "networkConnectivityAssociatedNetworkingCosts"
];

for (var i = 0; i < criteria.length; i++) {
  schemaSkeleton[criteria[i]] = {
    label: String,
    rating: Number,
    tags: Array,
    required: Boolean
  };
}

var cloudServiceProfileSchema = new mongoose.Schema(schemaSkeleton);

cloudServiceProfileSchema.pre('validate', function(next) {
  var saveDate = new Date;
  if (!this.createdAt) {
    this.createdAt = saveDate;
  }
  this.modifiedAt = saveDate;
  next();
});
  
cloudServiceProfileSchema.methods.getCriteria = function() {
  return criteria;
};

module.exports = mongoose.model('CloudServiceProfile',
  cloudServiceProfileSchema);  

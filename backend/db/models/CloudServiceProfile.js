var schemaSkeleton = {
  _id: {
    type: Number,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
    },
  modifiedDate: {
    type: Date,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  _cloudService: {
    type: Number,
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
  
module.exports = function(mongoose) {
  var cloudServiceProfileSchema = new mongoose.Schema(schemaSkeleton);
var CloudServiceProfile = mongoose.model('CloudServiceProfile',
  cloudServiceProfileSchema);

return CloudServiceProfile;
};

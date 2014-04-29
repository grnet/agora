/**
 * ServiceComplianceProfile
 *
 * @module      :: Model
 * @description :: Cloud Service Compliance Profile model.
 * @docs	:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    createdDate: {
      type: 'date',
      required: true
    },
    modifiedDate: {
      type: 'date',
      required: true
    },
    version: {
      type: 'string',
      required: true
    },
    intellectualPropertyRights: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    csp: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    ownership: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    nationalLawGovernance: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    concordanceNationalPrivacyActs: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    externalSecurityAuditCertificate: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    subcontractors: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    protectionMinorsUsers: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    serviceLevelAgreement: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    csSecurity: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    securityIncidentsHandling: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    dataBackupRestore: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    compatibility: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    dataProtection: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    personnel: {
      type: 'string',
      rating: 'integer',
      required: false
    },
    penalty: {
      type: 'string',
      rating: 'integer',
      required: false
    },
    supervision: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    dataAvailability: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    edpAudit: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    qualityReview: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    notification: {
      type: 'string',
      rating: 'integer',
      required: false
    },
    billing: {
      type: 'string',
      rating: 'integer',
      required: false
    },
    aai: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    userProvisioning: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    reportingMeteringSalesEstimates: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    networkConnectivityAssociatedNetworkingCosts: {
      type: 'string',
      rating: 'integer',
      tags: 'array',
      required: false
    },
    service_id: {
      type: 'string',
      required: true
    }
  }

};

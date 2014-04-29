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
  }

};

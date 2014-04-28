/**
 * Service
 *
 * @module      :: Model
 * @description :: Service model.
 * @docs	:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'text',
      required: true
    },
    url: {
      type: 'text',
      required: true,
      url: true
    },
    provider_id: {
      type: 'string',
      required: true
    }
  }

};

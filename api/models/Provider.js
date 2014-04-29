/**
 * Provider
 *
 * @module      :: Model
 * @description :: Cloud Service Provider model.
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
    country_id: {
      type: 'string',
      required: true
    }
  }

};

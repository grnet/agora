/**
 * Country
 *
 * @module      :: Model
 * @description :: Country model.
 * @docs	:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    isoCode: {
      type: 'string',
      required: true
    }
  }

};

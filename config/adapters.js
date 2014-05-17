/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different
 * global "saved settings" that you can mix and match in your models.
 * The `default` option indicates which "saved setting" should be used
 * if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

fs = require('fs');

var localData;

var localFile = __dirname + '/local.json';

fs.readFile(localFile, 'utf8', function(err, data) {
  if (!err) {
    localData = JSON.parse(data);

    module.exports.adapters = localData["adapter"];
  } else {  
    module.exports.adapters = {

      // If you leave the adapter config unspecified 
      // in a model definition, 'default' will be used.
      'default': 'mongo_dev',

      // Persistent adapter for DEVELOPMENT ONLY
      // (data is preserved when the server shuts down)
      disk: {
        module: 'sails-disk'
      },

      // Mongo adapter for DEVELOPMENT
      mongo_dev: {
        module   : 'sails-mongo',
        host     : 'localhost',
        port     : 27017,
        user     : 'agora',
        password : '',
        database : 'agora-dev'
      },

      // Mongo adapter for STAGING
      mongo_stage: {
        module   : 'sails-mongo',
        host     : 'localhost',
        port     : 27017,
        user     : '',
        password : '',
        database : 'agora-stage'
      },

      // Mongo adapter for PRODUCTION
      mongo_prod: {
        module   : 'sails-mongo',
        host     : 'localhost',
        port     : 27017,
        user     : '',
        password : '',
        database : 'agora-prod'
      }
    };
  }
});

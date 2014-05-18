var fs = require('fs');
var file = __dirname + '/providers.json';

exports.seed = function(options) {

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      sails.log.error(err);
      return;
    }

    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {
      var provider = data[i];
      Provider.create(provider).done(function(err, provider) {
        if (err) {
          sails.log.error(err);
        } else {
          sails.log.info("Provider created: ", provider.name);
        }
      });
    }
  });
};
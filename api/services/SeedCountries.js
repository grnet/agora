var fs = require('fs');
var file = __dirname + '/countries.json';

exports.seed = function(options) {

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      sails.log.error(err);
      return;
    }

    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {
      var country = data[i];
      Country.create(country).done(function(err, createdCountry) {
        if (err) {
          sails.log.error(err);
        } else {
          sails.log.info("Country created: ", createdCountry.name);
        }
      });
    }
  });
};

var fs = require('fs');
var file = __dirname + '/countries.json';

exports.seed = function(options) {

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {
      var country = data[i];
      Country.create(country).done(function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Country created: ", country);
        }
      });
    }
  });
};

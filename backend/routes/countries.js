var express = require('express');
var router = express.Router();

router.get('/api/countries', function (req, res){
  return Country.find(function (err, countries) {
    if (!err) {
      return res.send(countries);
    } else {
      return console.log(err);
    }
  });
});

module.exports = router;

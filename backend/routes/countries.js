var express = require('express');
var router = express.Router();
var Country = require('../db/models/Country');
var ErrorMessage = require('../lib/errormessage');
  
router.get('/', function (req, res){
  var term = new RegExp(req.query.term, "i");
  return Country.find({ name: term }, function (err, countries) {
    if (!err) {
      res.send(countries);
    } else {
      res.status(404).send(new ErrorMessage('Error querying countries.',
        'countryQuery'), 'error', err);
    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Criterion = require('../db/models/Criterion');
var ErrorMessage = require('../lib/errormessage');
  
router.get('/', function (req, res) {
  var term = new RegExp(req.query.term, "i");
  return Criterion.find({},
    function (err, criteria) {
      if (!err) {
        res.send(criteria);
      } else {
        console.log(err);
        res.status(404).send(new ErrorMessage('Could not read criteria.',
          'noReadCriteria'));
      }
    });
});

module.exports = router;
  

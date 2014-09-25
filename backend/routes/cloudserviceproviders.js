var express = require('express');
var router = express.Router();
var CloudServiceProvider = require('../db/models/CloudServiceProvider');

router.get('/', function (req, res) {
  return CloudServiceProvider.find(function (err, cloudServiceProviders) {
    var isAdmin = false;
    if (!err) {
      res.send(cloudServiceProviders);
    } else {
      console.log(err);
    }
  });
});

module.exports = router;

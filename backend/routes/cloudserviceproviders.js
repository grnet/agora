var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CloudServiceProvider =
  require('../db/models/CloudServiceProvider')(mongoose);

router.get('/', function (req, res) {
  return CloudServiceProvider.find(function (err, cloudServiceProviders) {
    if (!err) {
      return res.send(cloudServiceProviders);
    } else {
      return console.log(err);
    }
  });
});

module.exports = router;

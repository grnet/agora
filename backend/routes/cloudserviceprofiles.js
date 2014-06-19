var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CloudServiceProfile = require('../db/models/CloudServiceProfile')(mongoose);

router.get('/', function (req, res) {
  return CloudServiceProfile.find(function (err, cloudServiceProfiles) {
    if (!err) {
      return res.send(cloudServiceProfiles);
    } else {
      return console.log(err);
    }
  });
});

router.get('/:id', function (req, res) {
  return CloudServiceProfile.findOne({_id: req.params.id},
  function (err, cloudServiceProfile) {
    if (!err) {
      return res.send(cloudServiceProfile);
    } else {
      return console.log(err);
    }
  });
});
  
module.exports = router;

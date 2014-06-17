var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CloudService = require('../db/models/CloudService')(mongoose);

router.get('/', function (req, res) {
  return CloudService.find(function (err, cloudServices) {
    if (!err) {
      return res.send(cloudServices);
    } else {
      return console.log(err);
    }
  });
});

router.post('/', function (req, res){
  console.log("POST: ");
  console.log(req.body);
  var cloudService = new CloudService({
    name: req.body.name,
    description: req.body.description
  });
  cloudService.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(cloudService);
});

module.exports = router;

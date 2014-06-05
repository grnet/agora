var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Provider = require('../db/models/Provider')(mongoose);

router.get('/', function (req, res) {
  return Provider.find(function (err, providers) {
    if (!err) {
      return res.send(providers);
    } else {
      return console.log(err);
    }
  });
});

router.post('/', function (req, res){
  var product;
  console.log("POST: ");
  console.log(req.body);
  provider = new Provider({
    name: req.body.name,
    description: req.body.description,
    country: req.body.country,
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(provider);
});

module.exports = router;

var express = require('express');
var router = express.Router();
var CloudServiceProvider = require('../db/models/CloudServiceProvider');

router.get('/', function (req, res) {
  return CloudServiceProvider.find(function (err, cloudServiceProviders) {
    var isAdmin = false;
    var response = {};
    if (!err) {
      if (req.user) {
        isAdmin = req.user.groups.indexOf('admin') != -1;
      }
      response.canAdd = isAdmin;
      response.cloudServiceProviders = cloudServiceProviders;
      return res.send(response);
    } else {
      return console.log(err);
    }
  });
});

module.exports = router;

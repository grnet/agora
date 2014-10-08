var express = require('express');
var router = express.Router();
var User = require('../db/models/User');

router.get('/', function (req, res) {
  return User.find(function (err, users) {
    if (!err) {
      res.send(users);
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
  

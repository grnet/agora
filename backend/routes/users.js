var express = require('express');
var router = express.Router();
var User = require('../db/models/User');

router.get('/', function (req, res) {
  var term = new RegExp(req.query.term, "i");
  return User.find({ $or: [
      { firstName: term },
      { surname: term },
      { email: term },
      { username: term }
    ]},
    'firstName surname email username',
    function (err, users) {
      if (!err) {
        res.send(users);
      } else {
        console.log(err);
      }
    });
});

module.exports = router;
  

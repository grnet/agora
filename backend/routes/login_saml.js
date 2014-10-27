var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var conf = require('../config');
var jwt = require('jwt-simple');
require('../config/passport')(passport, conf);

router.post('/', function(req, res, next) {
  passport.authenticate('saml',function(err, user, info) {

    if (err) {
      return(next(err));
    }

    if (!user) {
      return(res.status(401).json(info));
    }

    var expires = moment().add('days', 7).valueOf();
    var token = jwt.encode({
        iss: user.id,
        exp: expires
    }, req.app.get('jwtTokenSecret'));
    res.redirect('/');
  })(req, res, next);
});

module.exports = router;

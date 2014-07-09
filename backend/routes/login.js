var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var jwt = require('jwt-simple'); 

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    if (err) {
      return(next(err));
    }
    
    if (!user) {
      return(res.json(info));
    }
    
    var expires = moment().add('days', 7).valueOf();
    var token = jwt.encode({
        iss: user.id,
        exp: expires
    }, req.app.get('jwtTokenSecret'));

    return(res.json({
        token : token,
        expires: expires,
        username: user.username,
        firstName: user.firstName,
        surname: user.surname,
        group: user.group
    }));
 })(req, res, next);
});

module.exports = router;

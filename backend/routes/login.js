var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var jwt = require('jwt-simple'); 
var conf = require('../config');

router.post('/', function(req, res, next) {
  var passport_strategy = 'local';
  if (conf.passport.saml.path
      && req.baseUrl == conf.passport.saml.path) {
    passport_strategy = 'saml';
    require('../config/passport')(passport, conf);
  }
  passport.authenticate('local', function(err, user, info) {

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

    return(res.json({
        token : token,
        expires: expires,
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        surname: user.surname,
        groups: user.groups
    }));
 })(req, res, next);
});

router.post('/saml/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    
    var expires = moment().add('days', 7).valueOf();
    var token = jwt.encode({
        iss: req.user.id,
        exp: expires
    }, req.app.get('jwtTokenSecret'));

    res.json({
      token : token,
      expires: expires,
      _id: req.user.id,
      username: req.user.email,
      firstName: req.user.firstName,
      surname: req.user.lastName,
      groups: ['edugain']
    });
 }); 

module.exports = router;

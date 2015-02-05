var express = require('express');
var router = express.Router();
var moment = require('moment');
var passport = require('passport');
var jwt = require('jwt-simple'); 
var conf = require('../config');
var fs = require('fs');
var ErrorMessage = require('../lib/errormessage');
var EntityDescriptor = require('../db/models/EntityDescriptor');
    
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

router.get('/saml', function (req, res, next) {
  if (req.query.idp) {
    var mquery = EntityDescriptor.where({"entityID": req.query.idp});
    mquery.findOne(function(err, idp) {
      if (!err && idp) {
        conf.passport.saml.entryPoint = idp.location;
      }
      require('../config/passport')(passport, conf);
      passport.authenticate('saml',
      {
        successRedirect : "/",
        failureRedirect : "/#/login"
      })(req, res, next);
    });
  }
});

router.post('/saml/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {

    var loginRedirect = "";
    var loginRedirectFile = fs.readFile(__dirname + '/../views/login_saml.html',
      'utf-8', 
      function(err, data) {
        
        if (err) {
          res.status(500).send(
            new ErrorMessage('Internal server error', 'noreadloginsaml',
              'error', err));
        } else {        
          loginRedirect = data;
          var expires = moment().add('days', 7).valueOf();
          var token = jwt.encode({
              iss: req.user.id,
              exp: expires,
              edugain: true
          }, req.app.get('jwtTokenSecret'));
        
          var tokenValue = {
            token : token,
            expires: expires,
            _id: req.user.id,
            username: req.user.email,
            firstName: req.user.firstName,
            surname: req.user.lastName,
            groups: ['edugain']
          };

          loginRedirect =
            loginRedirect.replace("/* REPLACE tokenValue HERE */",
              JSON.stringify(tokenValue));
          res.send(loginRedirect);
        }
      })
    ;
  }
); 

module.exports = router;

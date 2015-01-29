var User = require('../db/models/User.js');
var jwt = require('jwt-simple');
var ErrorMessage = require('./errormessage');

exports.doAuth = function(req, callback) {
  var callbk = callback || function() {};
  var token = (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];
  if (token) {
    try {
      var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
 
      if (decoded.exp <= Date.now()) {
        var msg = 'Access token has expired, please signout ' + 
          'and login again.';
        callbk(new ErrorMessage(msg, 'tokenExpired'));
      } else {
        User.findOne({ _id: decoded.iss }, function(err, user) {
          if (err || !user) {
            calback(new ErrorMessage('User not found.',
              'userNotFound', 'error', err || "No user found."));
          } else {
            req.user = user;
            callbk(null);
          }
        });
      }
    } catch (err) {
      callbk(new ErrorMessage('Invalid token.',
        'invalidToken', 'error', err));
    }
  } else {
    callbk(new ErrorMessage('No access token, please login.',
      'noAccessToken'));
  }
};
  
exports.authMid = function(req, res, next) {

  exports.doAuth(req, function(err) {
    if (err) {
      res.status(401).send(err);
    } else {
      next();
    };
  });
};

  

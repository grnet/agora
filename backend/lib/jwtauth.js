var User = require('../db/models/User.js');
var jwt = require('jwt-simple');
var ErrorMessage = require('./errormessage');

module.exports = function(req, res, next) {

  var token = (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];
  if (token) {
    try {
      var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
 
      if (decoded.exp <= Date.now()) {
        var msg = 'Access token has expired, please signout ' + 
          'and login again.';
        res.status(401).send(new ErrorMessage(msg, 'tokenExpired'));
      } else {
        User.findOne({ _id: decoded.iss }, function(err, user) {
          if (err || !user) {
            res.status(401).send(new ErrorMessage('User not found.',
              'userNotFound'));
          } else {
            req.user = user;
            next();
          }
        });
      }
    } catch (err) {
      res.status(401).send(new ErrorMessage('Invalid token.', 'invalidToken'));
    }
  } else {
    res.status(401).send(new ErrorMessage('No access token, please login.',
      'noAccessToken'));
  }
};

  

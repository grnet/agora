var User = require('../db/models/User.js');
var jwt = require('jwt-simple');

module.exports = function(req, res, next) {

  var token = (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.headers['x-access-token'];
  if (token) {
    try {
      var decoded = jwt.decode(token, req.app.get('jwtTokenSecret'));
 
      if (decoded.exp <= Date.now()) {
        res.status(401).send({
            error: {
              message: 'Access token has expired, please signout ' + 
                'and login again.',
              name: 'jwtauthError'
            }
        });
      } else {
        User.findOne({ _id: decoded.iss }, function(err, user) {
          if (err || !user) {
            res.status(401).send({
                error: {
                  message: 'User not found.',
                  name: 'jwtauthError'
                }
            });
          } else {
            req.user = user;
            next();
          }
        });
      }
    } catch (err) {
      res.status(401).send({
          error: {
            message: 'Invalid token.',
            name: 'jwtauthError'
          }
      });
    }
  } else {
    res.status(401).send({
        error: {
          message: 'No access token, please login.'},
          name: 'jwtauthError'
    });
  }
};

  

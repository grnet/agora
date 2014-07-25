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
        res.end('Access token has expired', 401);
      }

      User.findOne({ _id: decoded.iss }, function(err, user) {
        if (err) {
          res.send(401, { error: 'User not found' });
        } else {
          req.user = user;
          next();
        }
      });
    
    } catch (err) {
      res.send(401, { error: 'Invalid token' });
    }
  } else {
    res.send(401, {error: 'No access token'});
  }
};

  

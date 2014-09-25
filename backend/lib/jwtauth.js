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
        res.status(401).send('Access token has expired');
      } else {
        User.findOne({ _id: decoded.iss }, function(err, user) {
          if (err || !user) {
            res.status(401).send({ error: 'User not found.' });
          } else {
            req.user = user;
            next();
          }
        });
      }
    } catch (err) {
      res.status(401).send({ error: 'Invalid token.' });
    }
  } else {
    res.status(401).send({error: 'No access token, please login.'});
  }
};

  

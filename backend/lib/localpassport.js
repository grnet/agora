var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../db/models/User');

passport.use(new LocalStrategy(
  function(username, password, done) {

  User.findOne({ username :  username }, function(err, user) {
    if (err) {
      done(err);
    }
    
    // if no user is found, return the message
    if (!user) {
      done(null, false, {
        'errors': {
          'username': { message: 'No user found.' }
          }
        });
    } else {    
      // if the user is found but the password is wrong    
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          done(err);
        } else {
          if (!isMatch) {
            done(null, false, {
              'errors': {
                'password': { message: 'Wrong password.'}
                }
              });
          } else {
            // all is well, return successful user
            done(null, user);
          }
        }
      });
    }
  });
}));


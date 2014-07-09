var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../db/models/User')(mongoose);

passport.use(new LocalStrategy(
  function(username, password, done) {

  User.findOne({ username :  username }, function(err, user) {
    if (err)
      return done(err);

    // if no user is found, return the message
    if (!user)
      return done(null, false, {
        'errors': {
          'username': { message: 'No user found.' }
          }
        });
    
    // if the user is found but the password is wrong
    if (!user.comparePassword(password) != true)
      return done(null, false, {
        'errors': {
          'password': { message: 'Wrong password.'}
          }
        });
        
    // all is well, return successful user
    return done(null, user);
  });

  }
));

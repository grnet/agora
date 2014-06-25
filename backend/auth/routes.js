var moment = require('moment'); 
var jwt = require('jwt-simple');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.html');
  });

  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.html', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { next(err); }
      if (!user) {
        res.redirect('/login');
      }
      var expires = moment().add('days', 7).valueOf();
      var token = jwt.encode({
          iss: user.id,
          exp: expires
      }, app.get('jwtTokenSecret'));
 
      res.json({
          token : token,
          expires: expires,
          user: user.toJSON()
      });
    })(req, res, next);
  });


  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.html', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};


function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

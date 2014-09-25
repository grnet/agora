var express = require('express');
var session = require('express-session');
var path = require('path');
var winston = require('winston');
var mongoose = require('mongoose');
var passport = require('passport');
var localPassport = require('./lib/localpassport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var conf = require('./config');
var countries = require('./routes/countries');
var cloudServiceProviders = require('./routes/cloudserviceproviders');
var cloudServices = require('./routes/cloudservices');
var jwt = require('jwt-simple');
var login = require('./routes/login');
var jwtauth = require('./lib/jwtauth');

var app = express();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new winston.transports.File({ filename: 'logs/all-logs.log' })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)(),
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  exitOnError: false
});
  
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
var publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// required for passport
app.use(session({secret: 'geantcloudmarketplacegeantcloudmarketplace' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// setting the jwt secret
app.set('jwtTokenSecret', 'geantcloudmarketplacegeantcloudmarketplace');

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);


app.use('/api/login', login);
    
app.get('/api', function (req, res) {
  res.send('AGORA API is running');
});

app.all('/api/cloudservices', jwtauth); 
app.all('/api/cloudservices/*', jwtauth); 
app.all('/api/providers', jwtauth); 
  
app.use('/api/countries', countries);
app.use('/api/providers', cloudServiceProviders); 
app.use('/api/cloudservices', cloudServices);
  
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  next(err);
});
  
app.listen(conf.nodejs_port, function() {
  console.log('Express server listening on port %d in %s mode',
    conf.nodejs_port, app.get('env'));
});

var express = require('express');
var http = require('http');
var https = require('https');
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
var users = require('./routes/users');
var criteria = require('./routes/criteria');
var login = require('./routes/login');
var jwtauth = require('./lib/jwtauth');
var util = require('util');
var moment = require('moment');
var saml_metadata = require('./routes/saml_metadata');
var tls = require('tls');
var ErrorMessage = require('./lib/errormessage');
  
var app = express();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: path.join(__dirname,
    'logs/all-logs.log')})
  ],
  exceptionHandlers: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: path.join(__dirname,
    'logs/exceptions.log')})
  ],
  exitOnError: false
});
  
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded());
app.use(cookieParser());
var publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));
  
// required for passport
app.use(passport.initialize());
app.use(flash());

// setting the jwt secret
app.set('jwtTokenSecret', conf.jwt_token_secret);

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);


app.use('/api/login', login);

app.use('/api/login*', login);

require('./config/passport')(passport, conf);

app.use('/api/login/saml', login);

app.use('/api/saml/metadata', saml_metadata);
    
app.get('/api', function (req, res) {
  res.send('Agora API is running');
});

app.all('/api/cloudservices', function(req, res, next) {
  if (req.method == 'GET') {
    jwtauth.doAuth(req, function (err) {
      next();
    });
  } else {
    jwtauth.authMid(req, res, next);
  }
});    
  
app.all('/api/cloudservices/*', jwtauth.authMid);
app.use('/api/cloudserviceproviders', function(req, res, next) {
  if (req.method == 'GET') {
    jwtauth.doAuth(req, function (err) {
      next();
    });
  } else {
    jwtauth.authMid(req, res, next);
  }
});
app.all('/api/cloudserviceproviders/.+/.+', jwtauth.authMid);
app.all('/api/users', jwtauth.authMid);
    
app.use('/api/cloudserviceproviders', cloudServiceProviders);
app.use('/api/cloudservices', cloudServices);
app.use('/api/users', users);
app.use('/api/countries', countries);
app.use('/api/criteria', criteria);      

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(new ErrorMessage('Internal server error. ' + err,
      'internalServerError',
      'error',
      err));
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(new ErrorMessage('Internal server error.',
        'internalServerError',
        'error',
        err));
  });
}
  
if (conf.ssl) {
  https.createServer(conf.ssl_options, app).listen({
          port: conf.nodejs_port,
          host: conf.nodejs_host,
        }, function(){
    logger.log('info', 'Express server listening on port %d in %s mode (https)',
      conf.nodejs_port, app.get('env'));
  });
} else {
  http.createServer(app).listen({
      port: conf.nodejs_port,
      host: conf.nodejs_host,
    }, function(){
  logger.log('info', 'Express server listening on port %d in %s mode (http)',
    conf.nodejs_port, app.get('env'));
  });
}

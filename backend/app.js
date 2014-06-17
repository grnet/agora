var express = require('express'),
  path = require('path'),
  logger = require('winston'),  
  mongoose = require('mongoose'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),    
  conf = require('./config'),
  countries = require('./routes/countries'),  
  providers = require('./routes/providers'),
  cloudServices = require('./routes/cloudservices');

var app = express();

app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
var publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);

app.get('/', function(req, res){
	res.send("Marketplace application for Cloud Services, developed for the GÉANT network. ETA: Summer 2014");
});

app.get('/agora', function(req, res){
  res.render('layout', { title: 'AGORA Market Place' });
});

app.get('/api', function (req, res) {
  res.send('AGORA API is running');
});

app.use('/api/countries', countries);
app.use('/api/providers', providers); 
app.use('/api/cloudservices', cloudServices); 

/// error handlers

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
  
app.listen(conf.nodejs_port, function() {
  console.log('Express server listening on port %d in %s mode',
    conf.nodejs_port, app.get('env'));
});

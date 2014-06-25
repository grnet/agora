var express = require('express'),
  session = require('express-session'),
  path = require('path'),
  logger = require('winston'),  
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash    = require('connect-flash'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),    
  conf = require('./config'),
  countries = require('./routes/countries'),  
  cloudServiceProviders = require('./routes/cloudserviceproviders'),
  cloudServices = require('./routes/cloudservices'),
  cloudServiceProfiles = require('./routes/cloudserviceprofiles');

var app = express();

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

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);


app.get('/api', function (req, res) {
  res.send('AGORA API is running');
});

app.use('/api/countries', countries);
app.use('/api/providers', cloudServiceProviders); 
app.use('/api/cloudservices', cloudServices);
app.use('/api/cloudserviceprofiles', cloudServiceProfiles);

// Configure passport
require('./config/passport')(passport);

//setup the routes
require('./config/routes.js')(app, passport);


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

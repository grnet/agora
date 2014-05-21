var express = require('express'),
    mongoose = require('mongoose'),
    conf = require('./config');

var app = express();

app.configure(function(){
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));
  app.use('/components', express.static(__dirname + '/bower_components'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db, conf.mongo_options);

var Country = require('./models/Country')(mongoose);
var Provider = require('./models/Provider')(mongoose);
var SPProfileModel = require('./models/ServiceProviderProfile')(mongoose);

app.get('/', function(req, res){
	res.send("Marketplace application for Cloud Services, developed for the GÉANT network. ETA: Summer 2014");
});

app.get('/agora', function(req, res){
  res.render('layout', { title: 'AGORA Market Place' });
});

app.get('/api', function (req, res) {
  res.send('AGORA API is running');
});

app.get('/api/countries', function (req, res){
  return Country.find(function (err, countries) {
    if (!err) {
      return res.send(countries);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/providers', function (req, res){
  return Provider.find(function (err, providers) {
    if (!err) {
      return res.send(providers);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/providers', function (req, res){
  var product;
  console.log("POST: ");
  console.log(req.body);
  provider = new Provider({
    name: req.body.name,
    description: req.body.description,
    country: req.body.country,
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(provider);
});

app.listen(conf.nodejs_port);
var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    conf = require('./config');

var app = express();

app.configure(function(){
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));
    app.use('/components', express.static(__dirname + '/bower_components'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    //required for passport
    app.use(express.session({ secret: 'agora marketplace' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash()); // use connect-flash for flash messages stored in session
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db, conf.mongo_options);

require('./config/passport')(passport); // pass passport for configuration

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
        country: req.body.country
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


app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user, message: req.session.messages });
});
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.messages = [info.message];
            return res.redirect('/login')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/register', function(req, res) {
    res.render('register', { message: req.flash('registration') });
});
app.post('/register', passport.authenticate('local-register', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the register page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(conf.nodejs_port);


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}
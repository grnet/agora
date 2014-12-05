var fs = require('fs');
var assert = require('assert');
var async = require('async');
var nopt = require('nopt');
var path = require('path');

var mongoose = require('mongoose');
var conf = require('../../config'); 

var Country = require('../models/Country');

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);  

var knownOpts = { 'inputfile': [path, null]};
var shortHands = { 'i': ['--inputfile']};

var parsed = nopt(knownOpts, shortHands);

var db = mongoose.connection.db;

function saveObject(obj, callback) {
  obj.save(function (err) {
    if (err) {
      console.log('Error creating ' + obj.modelName
        + ': ' + err);
    } else {
        console.log('Saved ' + obj.constructor.modelName 
        + ': ' + obj.name);
    }
    if (callback) {
      callback();
    }
  });
}

var inputFile = '';

if (parsed.inputfile) {
  inputFile = parsed.inputfile;
} else {
  inputFile = __dirname + '/countries.json';
}
    
fs.readFile(inputFile, 'utf8', function(err, data) {
  var seedData = JSON.parse(data);
  for (var i = 0; i < seedData.length; i++) {
    var countryData = seedData[i];
    var country = new Country(countryData);
    saveObject(country);
  }
});

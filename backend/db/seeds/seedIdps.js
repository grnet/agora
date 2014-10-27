var fs = require('fs');
var assert = require('assert');
var async = require('async');

var mongoose = require('mongoose');
var conf = require('../../config'); 

var Idp = require('../models/Idp');

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);  

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

fs.readFile(__dirname + '/idps.json', 'utf8', function(err, data) {
  var seedData = JSON.parse(data);
  for (var i = 0; i < seedData.length; i++) {
    var idpData = seedData[i];
    var idp = new Idp(idpData);
    saveObject(idp);
  }
});

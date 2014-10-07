"use strict";

var yaml = require('js-yaml');
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;  
  
var CriterionSchema = require('../models/Criterion');

var mongoose = require('mongoose');
var conf = require('../../config'); 

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);  

var i = 0;
var j = 0;
var criterion = null;

var progressTracker = new EventEmitter();
  
var finish = function (i) {
  if (i == 0) {
    process.exit(0);
  }
};

try {
  var doc = yaml.safeLoad(fs.readFileSync(process.argv[2], 'utf8'));
  while (doc.length > 0) {
    i++;
    criterion = new CriterionSchema(doc.shift());
    criterion.save(function (err, savedObj) {
      if (err) {
        console.log('Error creating ' + savedObj.modelName
          + ': ' + err);
      } else {
        console.log('Saved ' + savedObj.constructor.modelName 
          + ': ' + savedObj.name);
      }
      progressTracker.emit('saved');
    });
  }
} catch (e) {
  console.log(e);
}

progressTracker.on('saved', function() {
  j++;
  if (j == i - 1) {
    console.log("Total: " + j);
    process.exit(0);
  }
});

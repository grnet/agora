var fs = require('fs');
var assert = require('assert');
var async = require('async');

var mongoose = require('mongoose');
var conf = require('../../config'); 

var User = require('../models/User');
var CloudServiceProvider = require('../models/CloudServiceProvider');
var CloudService = require('../models/CloudService');

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

function createObject(objectData, SeedModel, ReferencedModel, referenceId,
  lookUpAttr, referenceAttr, callback) {
  var newObj = null;
  var criterion = {};
  criterion[lookUpAttr] = objectData[referenceAttr];
  ReferencedModel.findOne(criterion,
    function(err, referencedObj) {
      if (err) {
        console.log(err);
      } else {
        delete objectData[referenceAttr];
        objectData[referenceId] = referencedObj._id;
        newObj = new SeedModel(objectData);
        newObj.save(function (err, savedObj) {
          if (err) {
            console.log('Error creating ' + savedObj.modelName
              + ': ' + err);
          } else {
            console.log('Saved ' + savedObj.constructor.modelName 
              + ': ' + savedObj.name);
          }
          if (callback) {
            callback();
          }
        });
      }
    });
}

function createObjects(data, SeedModel, ReferencedModel, referenceId,
  lookUpAttr, referenceAttr, callback) {
  var objectData = null;
  var newObj = null;
  var criterion = {};  
  if (data.length > 0) {
    objectData = data.shift();
    criterion[lookUpAttr] = objectData[referenceAttr];
    ReferencedModel.findOne(criterion,
      function(err, referencedObj) {
        if (err) {
          console.log(err);
        } else {
          delete objectData[referenceAttr];
          objectData[referenceId] = referencedObj._id;
          newObj = new SeedModel(objectData);
          newObj.save(function (err, savedObj) {
            if (err) {
              console.log(err);
              callback(err, false);
            } else {
              console.log('Saved ' + savedObj.constructor.modelName 
                + ': ' + savedObj.name);
              createObjects(data, SeedModel, ReferencedModel, referenceId,
                lookUpAttr, referenceAttr, callback);
            }
          });          
        }
    });
  } else {
    callback(null, true);
  }
}
  
function seedModelData(filename, SeedModel, ReferencedModel,
  referenceId, lookUpAttr, referenceAttr, callback) {
  var data = null;
  var seedData = null;
  async.series([
    function(callback) {
      fs.readFile(__dirname + '/' + filename, 'utf8', function(err, d) {
        data = d;
        callback(err, 'readFile');        
      });
    },
    function(callback) {
      seedData = JSON.parse(data);
      SeedModel.remove({}, function(err) {
        callback(err, 'Remove');
      });
    },
    function(callback) {
      console.log('CreateObjects');      
      createObjects(seedData, SeedModel, ReferencedModel, referenceId,
        lookUpAttr, referenceAttr, function(err, data) {
          callback(err, 'CreateObjects');
      });
    }],
    function(err, result) {
      console.log(result);
      callback();
    }
  );
};
  
async.series([
  function(callback){
    seedModelData('cloudserviceproviders.json', CloudServiceProvider, User,
      '_user', 'username', 'username', function() {
        callback(null, 'CloudServiceProviders');
    });
  },
  function(callback){
    seedModelData('cloudservices.json', CloudService, CloudServiceProvider,
      '_cloudServiceProvider', 'name', 'cloudServiceProviderName',
      function() {
        callback(null, 'CloudServices');
      });
  }],
  function(err, results){
    console.log(results);
    process.exit(0);
  }
);

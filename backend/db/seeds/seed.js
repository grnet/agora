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

/**
 * Seed model data from file.
 *
 * The file contains JSON data for a particular model. Each instance of
 * the model references another model. The function will read the instance
 * model data and lookup the referenced instance via a specified attribute.
 * It will then fix the reference using the referenced ID and delete the
 * attribute that has been used for the look up, since it is not needed.
 *
 * For example, if we have an instance of class A:
 * foo = { a: 'valueForA', lookUpAttr: 'lookUpForB'}
 * then the function we look up an instance of class B that will have
 * a referenceAttr equal to lookUpForB. It will take its ID and insert
 * it into foo as the value of the referenceId attribute and delete
 * the lookUpAttr since it is not really part of the schema of class A.
 *
 * @param {string} filename JSON file containing the model data.
 * @param {SeedModel} SeedModel the Mongoose schema for the model data. 
 * @param {ReferencedModel} ReferencedModel the Mongoose schema for the 
 * referenced model data.
 * @param {Schema.Types.ObjectId} referenceId the id, acting as foreign key,
 * for the referenced model data from the model data.
 * @param {string} lookUpAttr the attribute in the model data that will be
 * used to lookup the referenceId of the referenced data.
 * @param {string} referenceAttr the attribute in the referenced data that
 * must match the lookUpAttr.
 * @param {Function} callback a callback.
 * @param {ReferencedModel} 
 * 
 */
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

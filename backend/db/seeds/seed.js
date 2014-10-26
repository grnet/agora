var fs = require('fs');
var assert = require('assert');
var async = require('async');

var mongoose = require('mongoose');
var conf = require('../../config'); 

var User = require('../models/User');
var CloudServiceProvider = require('../models/CloudServiceProvider');
var CloudService = require('../models/CloudService');
var Country = require('../models/Country');
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

function resolveRef(objectData, refData, callback) {
  var lookUpAttr = refData.lookUpAttr;
  var referenceId = refData.referenceId;
  var referenceAttr = refData.referenceAttr;
  var ReferencedModel = refData.ReferencedModel;
  var query = {};
  var newObj = null;
  query[lookUpAttr] = objectData[referenceAttr];
  ReferencedModel.findOne(query,
    function(err, referencedObj) {
      var msg = '';
      if (err) {
        console.log(err);
        callback(err);
      } else if (!referencedObj) {
        msg = 'Object ' + ReferencedModel.modelName
          + ' ' + objectData[referenceAttr] + ' not found'; 
        console.log(msg);       
        callback(msg);
      } else {
        delete objectData[referenceAttr];
        objectData[referenceId] = referencedObj._id;
        callback(null);
      }
    });
}

function createObject(SeedModel, refs, objectData, callback) {
  var newObj = null;
  async.each(refs, resolveRef.bind(null, objectData), function(err) {
    if (err) {
      console.log('Failed to resolve references');
    } else {
      newObj = new SeedModel(objectData);
      newObj.save(function (err, savedObj) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          console.log('Saved ' + savedObj.constructor.modelName 
            + ': ' + savedObj.name);
          callback(null);
        }
      });          
    }
  });
} 
  
function createObjects(data, SeedModel, refs, callback) {
  async.each(data, createObject.bind(null, SeedModel, refs), function(err) {
    if (err) {
      console.log('Failed to create objects');
      callback(err);
    } else {
      callback(null);
    }
  });
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
 * @param {refs} Array an array with objects containing the following fields:
 * ReferencedModel, the Mongoose schema for the referenced model data.
 * referenceId, of type Schema.Types.ObjectId, the id, acting as foreign key,
 * for the referenced model data from the model data.
 * lookUpAttr, the attribute name in the model data that will be
 * used to lookup the referenceId of the referenced data.
 * referenceAttr the attribute name in the referenced data that
 * must match the lookUpAttr.
 * @param {Function} callback a callback.
 */
function seedModelData(filename, SeedModel, refs, callback) {
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
      createObjects(seedData, SeedModel, refs, function(err, data) {
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
    var refs = [{
      ReferencedModel: User,
      referenceId: '_user',
      lookUpAttr: 'username',
      referenceAttr: 'username'
    }, {
      ReferencedModel: Country,
      referenceId: '_country',
      lookUpAttr: 'name',
      referenceAttr: 'country'      
    },{
      ReferencedModel: Idp,
      referenceId: '_idp',
      lookUpAttr: 'entityId',
      referenceAttr: 'entryPoint'      
    }];
    seedModelData('cloudserviceproviders.json', CloudServiceProvider, refs,
      function() {
        callback(null, 'CloudServiceProviders');
    });
  },
  function(callback){
    var refs = [{
      ReferencedModel: CloudServiceProvider,
      referenceId: '_cloudServiceProvider',
      lookUpAttr: 'name',
      referenceAttr: 'cloudServiceProviderName'
    }];
    seedModelData('cloudservices.json', CloudService, refs,
      function() {
        callback(null, 'CloudServices');
      });
  }],
  function(err, results){
    console.log(results);
    process.exit(0);
  }
);

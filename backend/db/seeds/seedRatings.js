"use strict";

var async = require('async');
var EventEmitter = require("events").EventEmitter;  

var CloudServiceSchema= require('../models/CloudService');
var CloudServiceProviderSchema= require('../models/CloudServiceProvider');  
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

var criteria = [
  "intellectualPropertyRights",
  "processingData",
  "ownership",
  "dataProtection",
  "requestsForDataAccessFrom3rdParties",
  "notification",
  "liquidatedDamages",
  "externalSecurityAuditCertificate",
  "concordanceWithNationalPrivacyActs",
  "securityOfTheCloudService",
  "managingSecurityIncidents",
  "dataBackupAndRestore",
  "compatibility",
  "portability",
  "supervision",
  "electronicDataProcessing",
  "networkConnectivity",
  "aai",
  "userProvisioning",
  "protectionOfMinorsAsUsers",
  "subcontractors",
  "serviceLevelAgreement",
  "qualityReview",
  "informationPerformance",
  "reportingMeteringSalesEstimates",
  "billing",
  "governingLaw",
  "peeringConnectivityCosts"
];

function rateService(service, cbk) {

  async.each(criteria, function(criterionName, callback) {
    CriterionSchema.findOne({name: criterionName}, function(err, criterion) {
        var msg = "";
        if (err) {
          console.log(err);
          callback(err);
        } else if (!criterion) {
          msg = 'Not found: ' + criteria[i];
          console.log(msg);
          callback(msg);
        } else {
          service.ratings.push({
            _criterion: criterion._id,
            mark: 2
          });
          callback();
        }
    });
  },
  function(err) {
      if (err) {
      console.log('Failed to rate all criteria');
    } else {
      service.save(function(err, savedObj) {
        if (err) {
          console.log(err);
        } else {
          console.log('Rated service: ' + service.name);
          cbk();
        }
      });      
    }
  });
}

CloudServiceSchema.findOne({name: process.argv[2]}, function(err, service) {
  if (err) {
    console.log(err);
  } else if (service == null) {
    console.log('No service ' + process.argv[2] + ' found');
  } else {
    rateService(service, function() {
      console.log('Done');
    });
  }
});

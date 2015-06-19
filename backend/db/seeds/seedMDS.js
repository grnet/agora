var fs = require('fs');
var request = require('request');
var strict = true;
var options = { position: true };
var util = require('util');
  
var saxStream = require("sax").createStream(strict, options);
  
var mongoose = require('mongoose');
var conf = require('../../config'); 

var EntityDescriptor = require('../models/EntityDescriptor');

mongoose.connect('mongodb://' + conf.mongo_server + '/' + conf.mongo_db,
  conf.mongo_options);  
  
saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e);
  // clear the error
  this._parser.error = null;
  this._parser.resume();
});

var entityDescriptors = {};
var latestDescriptor = null;
var feedRead = false;
var numSaved = 0;
var numErrors = 0;
  
var startDateTime = Date.now();
  
saxStream.on("opentag", function (node) {

  var entityID = null;
  var descriptor = latestDescriptor;
  var position = this._parser.position;
  
  if (node.name == 'md:EntityDescriptor') {
    entityID = node.attributes['entityID'];
    descriptor = {
      collected: null,
      readingCertificate: false,
      position: position,
      previous: latestDescriptor,
      tags: []
    };
    latestDescriptor = descriptor;
    entityDescriptors[entityID] = descriptor;
    descriptor.collected = new EntityDescriptor({
      entityID: entityID,
      location: null,
      certificate: ""
    });
    descriptor.tags.push(node.name);
  } else {
    while (descriptor && descriptor.position > position) {
      descriptor = descriptor.previous;
    }    
    if (descriptor && node.name == 'md:SingleSignOnService'
      && node.attributes['Binding'] ==
      'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect') {
      descriptor.collected.location = node.attributes['Location'];
      descriptor.tags.push(node.name);    
    } else if (descriptor && node.name == 'ds:X509Certificate') {
      descriptor.readingCertificate = true;
      descriptor.tags.push(node.name);    
    }
  }
  
});

saxStream.on("closetag", function(tagName) {

  var position = this._parser.position;
  var descriptor = latestDescriptor;
  var nextDescriptor = null;

  while (descriptor && descriptor.position > position) {
    nextDescriptor = descriptor;
    descriptor = descriptor.previous;
  }

  if (!descriptor) {
    return;
  }
  
  var collected = null; 
  if (tagName == 'ds:X509Certificate') {
    collected = descriptor.collected;
    collected.certificate =
      collected.certificate.replace(/^(\s+).+(\s+)$/, '');
      descriptor.readingCertificate = false;
  }

  var tags = descriptor.tags;
  var i = tags.indexOf(tagName);
  if (i != -1) {
    tags.splice(i, 1);
    if (tags.length == 0) {
      if (!collected) {
        collected = descriptor.collected;
      }
      EntityDescriptor.findOne({ 'entityID': descriptor.collected.entityID },
        function(err, results) {
          var toSave = null;
          if (results) {
            results.location = collected.location;
            results.certificate = collected.certificate;
            toSave = results;
          } else {
            toSave = collected;
          }
          toSave.save({writeconcern: {w: 1, j: true} }, function (err) {
            if (err) {
              console.log(err);
              console.log(toSave);
              numErrors++;
            } else {
              numSaved++;
            }
            if (nextDescriptor) {
              nextDescriptor.previous = descriptor.previous;
            }
            console.log(collected.entityID);
            delete entityDescriptors[collected.entityID];
            if (feedRead && Object.keys(entityDescriptors).length == 0) {
              console.log("Saved: ", numSaved);
              console.log("Errors: ", numErrors);              
              process.exit();
            }
          });        
        });
      }
    }
});

saxStream.on("text", function(text) {

  var position = this._parser.position;  
  var descriptor = latestDescriptor;

  while (descriptor && descriptor.position > position) {
    descriptor = descriptor.previous;
  }

  if (!descriptor) {
    return;
  }
  
  if (descriptor.readingCertificate) {
    descriptor.collected.certificate += text;
  }
});

saxStream.on("end", function() {
  EntityDescriptor.remove({ updatedAt: { $exists: true, $lt: startDateTime } },
    function(err) {
      if (err) {
        console.log(err);
      }
      feedRead = true;
      if (Object.keys(entityDescriptors).length == 0) {
        console.log("Saved: ", numSaved);
        console.log("Errors: ", numErrors);                      
        process.exit();
      }
  });
});
  
request('http://mds.edugain.org/').pipe(saxStream);
  

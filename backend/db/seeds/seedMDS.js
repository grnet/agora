var fs = require('fs');
var request = require('request');
var strict = true;
var options = {};
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

var entityID = null;
var entityDescriptors = {};
var readCertificate = false;

var startDateTime = Date.now();
  
saxStream.on("opentag", function (node) {
  if (node.name == 'md:EntityDescriptor') {
    entityID = node.attributes['entityID'];
    entityDescriptors[entityID] = {
        collected: null,
        tags: []
    };
    entityDescriptors[entityID].collected = new EntityDescriptor({
      entityID: entityID,
      location: null,
      certificate: ""
    });
    entityDescriptors[entityID].tags.push(node.name);
  } else if (entityID && node.name == 'md:SingleSignOnService'
    && node.attributes['Binding'] ==
      'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect') {
    entityDescriptors[entityID].collected.location =
      node.attributes['Location'];
    entityDescriptors[entityID].tags.push(node.name);    
  } else if (entityID && node.name == 'ds:X509Certificate') {
    readCertificate = true;
    entityDescriptors[entityID].tags.push(node.name);    
  }
  
});

saxStream.on("closetag", function(tagName) {

  if (!entityID) {
    return;
  }
  
  var collected = null; 
  var toSave = null;
  if (entityID && tagName == 'ds:X509Certificate') {
    collected = entityDescriptors[entityID].collected;
    collected.certificate =
      collected.certificate.replace(/^(\s+).+(\s+)$/, '');
    readCertificate = false;
  }

  var tags = entityDescriptors[entityID].tags;
  var i = tags.indexOf(tagName);
  if (i != -1) {
    tags.splice(i, 1);
    if (tags.length == 0) {
      if (!collected) {
        collected = entityDescriptors[entityID].collected;
      }
      console.log(collected.entityID);
      if (!collected.location) {
        delete entityDescriptors[entityID];
        entityID = null;
        return;
      }
      EntityDescriptor.findOne({ 'entityID': entityID },
        function(err, results) {
          if (results) {
            results.location = collected.location;
            results.certificate = collected.certificate;
            toSave = results;
          } else {
            toSave = collected;
          }
          toSave.save(function (err) {
            if (err) {
              console.log(err);
              console.log(toSave);
            }
            delete entityDescriptors[entityID];
            entityID = null;
          });        
        });
      }
    }
});

saxStream.on("text", function(text) {
  if (entityID && readCertificate) {
    entityDescriptors[entityID].collected.certificate += text;
  }
});

saxStream.on("end", function() {
  console.log(startDateTime);
  EntityDescriptor.remove({ createdAt: { $exists: true, $lt: startDateTime } },
    function(err) {
      if (err) {
        console.log(err);
      }
      console.log("Feed read");
  });
});
  
request('http://mds.edugain.org/').pipe(saxStream);
  

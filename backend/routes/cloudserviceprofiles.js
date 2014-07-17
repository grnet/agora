var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CloudServiceProfile = require('../db/models/CloudServiceProfile')(mongoose);

router.get('/', function (req, res) {
  return CloudServiceProfile.find(function (err, cloudServiceProfiles) {
    if (!err) {
      return res.send(cloudServiceProfiles);
    } else {
      return console.log(err);
    }
  });
});

router.get('/:id', function (req, res) {
  return CloudServiceProfile.findOne({_id: req.params.id},
  function (err, cloudServiceProfile) {
    if (!err) {
      var criteria = [];
      cloudServiceProfile.getCriteria().forEach(function(el, index, array) {
        criteria.push({
            order: index,
            name: el,
            contents: cloudServiceProfile[el]
        });
      });
      return res.send({
        _id: cloudServiceProfile._id,
        criteria: criteria
      });
    } else {
      return console.log(err);
    }
  });
});

router.put('/:id', function (req, res){
  CloudServiceProfile.findOne({_id: req.body._id},
    function (err, cloudServiceProfile) {
      if (!err) {
        var criteria = req.body.criteria;
        criteria.forEach(function(criterion, index, array) {
          cloudServiceProfile[criterion.name].rating =
            criterion.contents.rating;
        });
        cloudServiceProfile.save(function(err) {
          if (!err) {
            return res.send(cloudServiceProfile);
          } else {
            return console.log(err);
          }
        });
      } else {
        return console.log(err);
      }
  });
});

    
module.exports = router;

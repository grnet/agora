var express = require('express');
var router = express.Router();
var CloudServiceProvider = require('../db/models/CloudServiceProvider');
var CloudService = require('../db/models/CloudService');
var ErrorMessage = require('../lib/errormessage');
var async = require('async');
  
router.get('/', function (req, res) {
  var errors = [];
  var user = req.user;
  return CloudServiceProvider.find()
    .populate('_country', 'code')
    .exec(function (err, cloudServiceProviders) {
    if (!err) {
      var isAdmin = user && user.groups && user.groups.indexOf('admin') != -1;
      if (isAdmin) {
        res.send(cloudServiceProviders);
      } else {
        async.filter(cloudServiceProviders,
          function(item, callback) {
            if (user && item._user.equals(user._id)) {
              callback(true);
            } else {
              CloudService.findOne({
                _cloudServiceProvider: item._id,
                processingStatus: 2
              }).exec(function(err, cloudService) {
                if (!err && cloudService) {
                  callback(true);
                } else {
                  if (err) {
                    errors.push(err);
                  }
                  callback(false);
                }
              });
            }
          },
          function(filtered) {
            if (errors.length > 0) {
              res.status(404).send(
                new ErrorMessage('Could not read cloud services.',
                  'noReadCloudServices', 'error', errors));
            } else {
              res.send(filtered);
            }
          }
        );
      }
    } else {
    res.status(404).send(
      new ErrorMessage('Could not read cloud service providers.',
        'noReadCloudServiceProviders', 'error', err));
    }
  });
});

router.get('/:id', function (req, res) {
  CloudServiceProvider
    .findOne({_id: req.params.id})
    .populate('_user', '-password')
    .populate('_country')
    .exec(function (err, cloudServiceProvider) {
      if (!err && cloudServiceProvider) {
        res.send(cloudServiceProvider);
      } else {
        res.status(404).send(
          new ErrorMessage('Could not read cloud service provider.',
          'noReadCloudServiceProvider', 'error', err));
      }
  });
});

function checkProviderEditPermissions(id, user, callback) {
  CloudServiceProvider.findOne({_id: id},
    function (err, cloudServiceProvider) {
      if (err) {
        callback(err);
        return;
      }
      var isAdmin = user.groups && user.groups.indexOf('admin') != -1;
      if (isAdmin || cloudServiceProvider._user.equals(user._id)) {
        callback(null, cloudServiceProvider);
      } else {
        callback("User not allowed to edit.");
      }
    }
  );               
}

router.put('/:id', function (req, res) {
  checkProviderEditPermissions(req.body._id, req.user,
    function (err, cloudServiceProvider) {
      if (!err) {
        cloudServiceProvider.name = req.body.name;
        cloudServiceProvider.registeredName = req.body.registeredName;
        cloudServiceProvider.description = req.body.description;
        cloudServiceProvider.logo = req.body.logo;
        cloudServiceProvider._country = req.body._country._id;
        cloudServiceProvider._user = req.body._user._id;
        cloudServiceProvider.save(function(err) {
          if (!err) {
            res.send(cloudServiceProvider);
          } else {
            res.status(500).send(
              new ErrorMessage('Could not save cloud service provider.',
                'noSaveCloudServiceProvider', 'error', err));
          }
        });
      } else {
        res.status(401).send(
          new ErrorMessage('Could not edit cloud service provider.',
            'noEditCloudServiceProvider', 'error', err));
      }
  });
});


router.post('/', function (req, res) {
  var user = req.user;
  var isAdmin = user.groups && user.groups.indexOf('admin') != -1;
  if (isAdmin) {
    var cloudServiceProvider = new CloudServiceProvider({
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
      _country: req.body._country._id,
      _user: req.body._user._id
    });
    cloudServiceProvider.save(function(err) {
      if (!err) {
        res.send(cloudServiceProvider);
      } else {
        res.status(500).send(
          new ErrorMessage('Could not create cloud service provider.',
            'noCreateCloudServiceProvider', 'error', err));
      }
    });
  } else {
      res.status(401).send(
        new ErrorMessage('User not allowed to add provider',
          'noAddCloudServiceProvider', 'error', err));
  }
});
  
module.exports = router;

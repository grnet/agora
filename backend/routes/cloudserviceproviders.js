var express = require('express');
var router = express.Router();
var CloudServiceProvider = require('../db/models/CloudServiceProvider');
var ErrorMessage = require('../lib/errormessage');

router.get('/', function (req, res) {
  return CloudServiceProvider.find()
    .populate('_country', 'isoCode')
    .exec(function (err, cloudServiceProviders) {
    if (!err) {
      res.send(cloudServiceProviders);
    } else {
    res.status(404).send(
      new ErrorMessage('Could not read cloud service providers.',
        'noReadCloudServiceProviders'));
      console.log(err);
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
          'noReadCloudServiceProvider'));
        console.log(err);
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
      var isAdmin = user.groups.indexOf('admin') != -1;
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
        cloudServiceProvider.description = req.body.description;
        cloudServiceProvider._country = req.body._country;
        cloudServiceProvider._user = req.body._user._id;
        cloudServiceProvider.save(function(err) {
          if (!err) {
            res.send(cloudServiceProvider);
          } else {
            console.log(err);
            res.status(500).send(
              new ErrorMessage('Could not save cloud service provider',
                'noSaveCloudServiceProvider'));
          }
        });
      } else {
        console.log(err);
        res.status(401).send(
          new ErrorMessage(err, 'noEditCloudServiceProvider'));
      }
  });
});


router.post('/', function (req, res) {
  var user = req.user;
  var isAdmin = user.groups.indexOf('admin') != -1;
  if (isAdmin) {
    var cloudServiceProvider = new CloudServiceProvider({
      name: req.body.name,
      description: req.body.description,
      country: req.body.country,
      _user: req.body._user
    });
    cloudServiceProvider.save(function(err) {
      if (!err) {
        res.send(cloudServiceProvider);
      } else {
        console.log(err);
        res.status(500).send(
          new ErrorMessage('Could not create cloud service provider.'),
            'noCreateCloudServiceProvider');
      }
    });
  } else {
      res.status(401).send(
        new ErrorMessage('User not allowed to add provider',
          'noAddCloudServiceProvider'));
  }
});
  
module.exports = router;

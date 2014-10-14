var express = require('express');
var router = express.Router();
var CloudServiceProvider = require('../db/models/CloudServiceProvider');

router.get('/', function (req, res) {
  return CloudServiceProvider.find(function (err, cloudServiceProviders) {
    if (!err) {
      res.send(cloudServiceProviders);
    } else {
      console.log(err);
    }
  });
});

router.get('/:id', function (req, res) {
  CloudServiceProvider
    .findOne({_id: req.params.id})
    .populate('_user _country')  
    .exec(function (err, cloudServiceProvider) {
      if (!err && cloudServiceProvider) {
        res.send(cloudServiceProvider);
      } else {
        res.status(404).send({error: 'No Cloud Service Provider Found'});
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
        callback("User not allowed to edit");
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
        cloudServiceProvider.country = req.body.country;
        cloudServiceProvider._user = req.body._user;
        cloudServiceProvider.save(function(err) {
          if (!err) {
            res.send(cloudServiceProvider);
          } else {
            console.log(err);
            res.status(500).send({error: err});
          }
        });
      } else {
        console.log(err);
        res.status(401).send({error: err});
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
        res.status(500).send({error: err});
      }
    });
  } else {
      res.status(401).send({error:  "User not allowed to add provider"});
  }
});
  
module.exports = router;

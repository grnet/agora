var express = require('express');
var router = express.Router();
var CloudService = require('../db/models/CloudService');
var CloudServiceProvider = require('../db/models/CloudServiceProvider');    

router.get('/:id', function (req, res) {
  CloudService.findOne({_id: req.params.id},
  function (err, cloudService) {
    if (!err) {
      var criteria = [];
      if (cloudService) {
        res.send(cloudService);
      } else {
        res.send(404, {error: 'No Cloud Service Found'});
      }
    } else {
      console.log(err);
    }
  });
});
    
router.get('/', function (req, res) {
  return CloudService.find(function (err, cloudServices) {
    if (!err) {
      return res.send(cloudServices);
    } else {
      return console.log(err);
    }
  });
});  
    
router.post('/', function (req, res){
  var cloudService = new CloudService({
    name: req.body.name,
    description: req.body.description
  });
  cloudService.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(cloudService);
});

function checkServiceEditPermissions(req, callback) {
  CloudService.findOne({_id: req.body._id},
  function (err, cloudService) {
    if (err) {
      callback(err);
      return;
    }
    CloudServiceProfile.findOne({cloudServiceId: cloudService._id},
      function(err, cloudServiceProfile) {
        if (err) {
          callback(err);
          return;
        } 
        CloudServiceProvider.findOne({
          _id: cloudService.cloudServiceProviderId
        },
        function(err, cloudServiceProvider) {
          if (err) {
            callback(err);
            return;
          }
          if (cloudServiceProvider.userId == req.user.username) {
            callback(null, cloudServiceProfile);
          } else {
            console.log(req.user);
            callback("User not allowed to edit");
          }
        }
      );
      }
    );
    }
  );               
}

router.put('/:id/profile', function (req, res){
  checkServiceEditPermissions(req,
    function (err, cloudServiceProfile) {
      if (!err) {
        var criteria = req.body.criteria;
        criteria.forEach(function(criterion, index, array) {
          cloudServiceProfile[criterion.name].rating =
            criterion.contents.rating;
        });
        cloudServiceProfile.save(function(err) {
          if (!err) {
            res.send(cloudServiceProfile);
          } else {
            console.log(err);
            res.send(500, {error: err});
          }
        });
      } else {
        console.log(err);
        res.send(401, {error: err});
      }
  });
});

 
module.exports = router;

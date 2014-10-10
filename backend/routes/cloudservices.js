var express = require('express');
var router = express.Router();
var CloudService = require('../db/models/CloudService');
var CloudServiceProvider = require('../db/models/CloudServiceProvider');    

var processingStatusLabels = [
  'draft',
  'submitted',
  'published'
];
  
router.get('/:id', function (req, res) {
  CloudService
    .findOne({_id: req.params.id})
    .populate('_cloudServiceProvider ratings._criterion')
    .exec(function (err, cloudService) {
      var isAdmin = false;
      var provider = null;
      if (!err && cloudService) {
        /* If 'published' or admin user, grant access */
        isAdmin = req.user.groups.indexOf('admin') != -1;
        if (cloudService.processingStatus == 'published' || isAdmin) {
          if (!isAdmin) {
            cloudService.ratings.forEach(function(rating) {
              if (rating.comment && rating.mark == 2) {
                rating.comment = "";
              }
            });
          }
          res.send(cloudService);
        } else if ((provider = cloudService._cloudServiceProvider)
            && (provider._user.equals(req.user._id))) {
            res.send(cloudService);
          } else {
            res.status(404).send({
                error: {
                  message: 'Access Denied',
                  name: 'cloudservices'
                }
            });
          }        
      } else {
        res.status(404).send({
            error: {
              message: 'No Cloud Service Found',
              name: 'cloudservices'
            }
        });
      }
  });
});
    
router.get('/', function (req, res) {
  return CloudService.find(function (err, cloudServices) {
    if (!err) {
      cloudServices.forEach(function(cloudService) {
          cloudService.ratings = [];
      });
      return res.send(cloudServices);
    } else {
      return console.log(err);
    }
  });
});  
    
router.post('/', function (req, res){
  var cloudService = new CloudService({
    name: req.body.name,
    description: req.body.description,
    processingStatus: 0,
    _cloudServiceProvider: req.body._cloudServiceProvider
  });
  cloudService.save(function (err) {
    if (!err) {
      res.send(cloudService);
    } else {
      res.status(500).send({error: err});
      console.log(err);
    }
  });
});

function checkServiceEditPermissions(id, user, processingStatus, callback) {
  CloudService.findOne({_id: id})
    .populate('_cloudServiceProvider')
    .exec(function (err, cloudService) {
      if (err) {
        callback(err);
        return;
      }
      var isAdmin = user.groups.indexOf('admin') != -1;
      var provider = cloudService._cloudServiceProvider;
      if (isAdmin) {
        callback(null, cloudService);
      } else if (provider && provider._user.equals(user._id)
        && cloudService.processingStatus == 0) {
        if (processingStatus == 0 || processingStatus == 1) {
          callback(null, cloudService);
        } else {
          callback("User not allowed to change status to "
            + processingStatusLabels[processingStatus] + ".");
          }
      } else {
        callback("User not allowed to edit.");
      }
    }
  );               
}

router.put('/:id', function (req, res){
  checkServiceEditPermissions(req.body._id, req.user, req.body.processingStatus,
    function (err, cloudService) {
      if (!err) {
        cloudService.name = req.body.name;
        cloudService.description = req.body.description;
        var ratings = req.body.ratings;
        ratings.forEach(function(rating, index, array) {
          cloudService.ratings[index].mark = rating.mark;
          cloudService.ratings[index].comment = rating.comment;
        });
        cloudService.processingStatus = req.body.processingStatus;
        cloudService.save(function(err) {
          if (!err) {
            res.send(cloudService);
          } else {
            res.status(500).send({
                error: {
                  message: err,
                  name: 'cloudservices'
                }
            });
          }
        });
      } else {
        res.status(401).send({
                error: {
                  message: err,
                  name: 'cloudservices'
                }
        });
      }
  });
});

 
module.exports = router;

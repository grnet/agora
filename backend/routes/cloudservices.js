var express = require('express');
var router = express.Router();
var CloudService = require('../db/models/CloudService');
var CloudServiceProvider = require('../db/models/CloudServiceProvider');    

router.get('/:id', function (req, res) {
  CloudService
    .findOne({_id: req.params.id})
    .populate('_cloudServiceProvider')
    .exec(function (err, cloudService) {
      var isAdmin = false;
      var provider = null;
      if (!err && cloudService) {
        /* If 'published' or admin user, grant access */
        isAdmin = req.user.groups.indexOf('admin') != -1;
        if (cloudService.status == 'published' || isAdmin) {
          res.send(cloudService);
        } else if ((provider = cloudService._cloudServiceProvider)
            && (provider._user.equals(req.user._id))) {
            res.send(cloudService);
          } else {
            res.send(404, {error: 'Access Denied'});
          }        
      } else {
        res.send(404, {error: 'No Cloud Service Found'});
        console.log(err);
      }
  });
});
    
router.get('/', function (req, res) {
  return CloudService.find(function (err, cloudServices) {
    if (!err) {
      cloudServices.forEach(function(cloudService) {
          cloudService.criteria = [];
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

function checkServiceEditPermissions(id, user, callback) {
  CloudService.findOne({_id: id},
    function (err, cloudService) {
      if (err) {
        callback(err);
        return;
      }
      if (cloudService.status == 'published') {
        callback(null, cloudService);
        return;
      }
      var isAdmin = user.groups.indexOf('admin') != -1;
      var provider = cloudService._cloudServiceProvider;
      if (isAdmin || (provider && provider._user.equals(user._id))) {
        callback(null, cloudService);
      } else {
        callback("User not allowed to edit");
      }
    }
  );               
}

router.put('/:id', function (req, res){
  checkServiceEditPermissions(req.body._id, req.user,
    function (err, cloudService) {
      if (!err) {
        cloudService.name = req.body.name;
        cloudService.description = req.body.description;
        var criteria = req.body.criteria;
        var criterion = null;
        var criterionIndex = -1;
        criteria.forEach(function(criterion, index, array) {
          cloudService.criteria[index].rating = criterion.rating;
          cloudService.criteria[index].rating = criterion.comment;
        });
        cloudService.save(function(err) {
          if (!err) {
            res.send(cloudService);
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

 
module.exports = router;

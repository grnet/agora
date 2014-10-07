var express = require('express');
var router = express.Router();
var CloudService = require('../db/models/CloudService');
var CloudServiceProvider = require('../db/models/CloudServiceProvider');    
var CriterionSchema = require('../db/models/Criterion');
  
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
        if (cloudService.status == 'published' || isAdmin) {
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
            res.status(404).send({error: 'Access Denied'});
          }        
      } else {
        res.status(404).send({error: 'No Cloud Service Found'});
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
        var ratings = req.body.ratings;
        ratings.forEach(function(rating, index, array) {
          cloudService.ratings[index].mark = rating.mark;
          cloudService.ratings[index].comment = rating.comment;
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

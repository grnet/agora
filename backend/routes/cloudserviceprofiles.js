var express = require('express');
var router = express.Router();
var CloudServiceProfile = require('../db/models/CloudServiceProfile');
var CloudService = require('../db/models/CloudService');
var CloudServiceProvider = require('../db/models/CloudServiceProvider');

  
router.get('/', function (req, res) {
   CloudServiceProfile.find(function (err, cloudServiceProfiles) {
    if (!err) {
      res.send(cloudServiceProfiles);
    } else {
      console.log(err);
     }
   });
 });

 router.get('/:id', function (req, res) {
   CloudServiceProfile.findOne({_id: req.params.id},
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
       res.send({
         _id: cloudServiceProfile._id,
         criteria: criteria
       });
     } else {
       console.log(err);
     }
   });
 });

 function checkServiceEditPermissions(req, callback) {
   CloudServiceProfile.findOne({_id: req.body._id},
     function (err, cloudServiceProfile) {
       if (err) {
         callback(err);
         return;
       }
       CloudService.findOne({_id: cloudServiceProfile.cloudServiceId},
         function(err, cloudService) {
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

 router.put('/:id', function (req, res){
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

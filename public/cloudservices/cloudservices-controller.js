'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller('CloudServicesListCtrl',
  ['$scope', 'CloudServicesList', 'Utils',
  function($scope, CloudServicesList, Utils) {

    if (Utils.isAdmin($scope)) {
      $scope.canAdd = true;
    } else {
      $scope.canAdd = false;
    }
    
    $scope.cloudServices = CloudServicesList.query();
  }
]);

agoraAppCloudServicesController.controller(
  'CloudServiceProviderSelectCtrl',
  ['$scope', 'CloudServiceProvidersList',
   function($scope, CloudServiceProvidersList) {

     $scope.getCloudServiceProviders = function(val) {
       return CloudServiceProvidersList.query({term: val})
         .$promise.then(function(cloudServices) {
           return cloudServices;
         });
     };

     $scope.selectCloudServiceProvider = function($item, $model, $label) {
       $scope.cloudServiceDetails._cloudServiceProvider = $item._id;
     };
     
}]);
  
agoraAppCloudServicesController.controller(
  'CloudServiceNewCtrl',
  ['$scope', '$rootScope', '$window', 'CloudServiceDetails',
   function($scope, $rootScope, $window, CloudServiceDetails) {

   $scope.cloudServiceDetails = {
     'name': null,
     'description': null,
     '_cloudServiceProvider': null
   };
     
   $scope.update = function() {
     $scope.master = angular.copy($scope.cloudServiceDetails);
     CloudServiceDetails.save({},
       $scope.cloudServiceDetails,
         function(value, headers) {
           $window.scrollTo(0, 0);
           $rootScope.message = "Service saved.";
       },
       function(errorResponse) {
         $window.scrollTo(0, 0);
         $scope.reset();
       }
     );
   };

    $scope.reset = function() {
      $scope.cloudServiceDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function() {
      return angular.equals($scope.cloudServiceDetails, $scope.master);
    };

}]);
  
agoraAppCloudServicesController.controller('CommentModalCtrl',
  ['$scope', '$route', '$modal', '$log', 
  function($scope, $route, $modal, $log) {

  $scope.openCommentModal = function(size) {

    var modalInstance = $modal.open({
      templateUrl: $route.current.commentUrl,
      controller: 'CommentModalInstanceCtrl',
      size: size,
      resolve: {
        criterionLabel: function() {
          return $scope.rating._criterion.label;
        },
        commentText: function() {
          return $scope.rating.comment;
        }
      }
    });

    modalInstance.result.then(function(commentText) {
      $scope.rating.comment = commentText;
    });
  };
  
}]);

// Please note that $modalInstance represents a modal window
// (instance) dependency. It is not the same as the $modal service
// used above.

agoraAppCloudServicesController.controller('CommentModalInstanceCtrl',
  ['$scope', '$modalInstance', 'criterionLabel', 'commentText',
  function ($scope, $modalInstance, criterionLabel, commentText) {

  $scope.criterionLabel = criterionLabel;
  $scope.commentText = commentText;
  
  $scope.ok = function(commentText) {
    $modalInstance.close(commentText);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  
}]);
  
agoraAppCloudServicesController.controller('CloudServiceCtrl',
  ['$scope', '$rootScope', '$routeParams', '$window', 
   'CloudServiceDetails',
  function($scope, $rootScope, $routeParams, $window, CloudServiceDetails) {
    $scope.cloudServiceDetails =
      CloudServiceDetails.get({ cloudServiceId: $routeParams.id });    
      
    $scope.colours = [
      { name: 'Red', value: 0 },
      { name: 'Amber', value: 1 },
      { name: 'Green', value: 2 }
    ];

    $scope.nameEdit = false;
    $scope.descriptionEdit = false;

    $scope.canEdit = false;

    $scope.cloudServiceDetails.$promise.then(function() {
      $scope.master = angular.copy($scope.cloudServiceDetails);
      var isAdmin = $rootScope.user.groups.indexOf('admin') != -1;
      var provider = $scope.cloudServiceDetails._cloudServiceProvider;
      if (isAdmin || provider._user.equals($rootScope.user._id)) {
        $scope.canEdit = true;
      }
    });
    
    $scope.update = function(cloudServiceDetails) {
      $scope.nameEdit = false;
      $scope.descriptionEdit = false;    
      $scope.master = angular.copy(cloudServiceDetails);
      CloudServiceDetails.update({
          cloudServiceId: cloudServiceDetails._id
        },
        cloudServiceDetails,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $rootScope.message = "Profile updated.";
        },
        function(errorResponse) {
          $window.scrollTo(0, 0);
          $scope.reset();
        }
      );
    };

    $scope.reset = function() {
      $scope.cloudServiceDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function(cloudServiceDetails) {
      return angular.equals(cloudServiceDetails, $scope.master);
    };
    
  }
]);
  
  

'use strict';

var agoraAppCloudServiceProvidersController =
  angular.module('agoraAppCloudServiceProvidersController', []);

agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProvidersListCtrl',
  ['$scope', 'CloudServiceProvidersList',
  function($scope, CloudServiceProvidersList) {
    var isAdmin = false;
    if ($scope.user && $scope.user.groups.indexOf('admin') != -1) {
      isAdmin = true;
    }
    
    if (isAdmin) {
      $scope.canAdd = true;
    }
    $scope.cloudServiceProviders = CloudServiceProvidersList.query();
  }
]);

function displayName(user) {
  return user.username
    + " (" + user.firstName + " " + user.surname
    + " " + user.email + ")";
}
  
agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderUserCtrl',
  ['$scope', 'UsersList',
   function($scope, UsersList) {

     $scope.getUsers = function(val) {
       return UsersList.query({term: val}).$promise.then(function(users) {
         return users.map(function(user) {
           user.displayName = displayName(user); 
           return user;
         });
       });
     };

     $scope.selectUser = function($item, $model, $label) {
       $scope.cloudServiceProviderDetails._user = $item._id;
     };
     
}]);
  
agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderNewCtrl',
  ['$scope', '$rootScope', '$window',
   'CloudServiceProviderDetails',
   function($scope, $rootScope, $window, CloudServiceProviderDetails) {
   
   $scope.update = function(cloudServiceProviderDetails) {
     $scope.master = angular.copy(cloudServiceProviderDetails);
     CloudServiceProviderDetails.save({
       cloudServiceProviderId: cloudServiceProviderDetails._id
       },
       cloudServiceProviderDetails,
         function(value, headers) {
           $window.scrollTo(0, 0);
           $rootScope.message = "Provider saved.";
       },
       function(errorResponse) {
         $window.scrollTo(0, 0);
         $scope.reset();
       }
     );
   };

    $scope.reset = function() {
      $scope.cloudServiceProviderDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function(cloudServiceProviderDetails) {
      return angular.equals(cloudServiceProviderDetails, $scope.master);
    };

  }]);

  
agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderCtrl',
  ['$scope', '$rootScope', '$routeParams', '$window',
   'CloudServiceProviderDetails', 'Utils',
  function($scope, $rootScope, $routeParams, $window,
    CloudServiceProviderDetails, Utils) {

    if (Utils.isAdmin($scope)) {
      $scope.canEdit = true;
    } else {
      $scope.canEdit = false;
    }
    
    $scope.cloudServiceProviderDetails =
      CloudServiceProviderDetails.get({
          cloudServiceProviderId: $routeParams.id
      });
    
    $scope.cloudServiceProviderDetails.$promise.then(function() {
      $scope.master = angular.copy($scope.cloudServiceProviderDetails);
      $scope.cloudServiceProviderUser =
        displayName($scope.cloudServiceProviderDetails._user);
    });
    
    $scope.update = function(cloudServiceProviderDetails) {
      $scope.master = angular.copy(cloudServiceProviderDetails);
      CloudServiceProviderDetails.update({
          cloudServiceProviderId: cloudServiceProviderDetails._id
        },
        cloudServiceProviderDetails,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $rootScope.message = "Provider updated.";
        },
        function(errorResponse) {
          $window.scrollTo(0, 0);
          $scope.reset();
        }
      );
    };

    $scope.reset = function() {
      $scope.cloudServiceProviderDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function(cloudServiceProviderDetails) {
      return angular.equals(cloudServiceProviderDetails, $scope.master);
    };

    
  }
]);
  

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

function getUsers(val, UsersList) {
  return UsersList.query({term: val}).$promise.then(function(users) {
    return users.map(function(user) {
      var displayName = user.username
        + " (" + user.firstName + " " + user.surname
        + " " + user.email + ")";
      user.displayName = displayName;
      return user;
    });
  });
};
  
agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderNewCtrl',
  ['$scope', '$rootScope', '$window',
   'CloudServiceProviderDetails', 'UsersList',
   function($scope, $rootScope, $window,
     CloudServiceProviderDetails, UsersList) {

   $scope.getUsers = function(val) {
     return getUsers(val, UsersList);
   };
 
   $scope.selectUser = function($item, $model, $label) {
     $scope.cloudServiceProviderDetails._user = $item._id;
   };
   
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
   'CloudServiceProviderDetails', 'UsersList', 'Utils',
  function($scope, $rootScope, $routeParams, $window,
    CloudServiceProviderDetails, UsersList, Utils) {

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
        $scope.cloudServiceProviderDetails._user.username
        + " (" + $scope.cloudServiceProviderDetails._user.firstName
        + " " + $scope.cloudServiceProviderDetails._user.surname
        + " " + $scope.cloudServiceProviderDetails._user.email + ")";
    });
    
    $scope.getUsers = function(val) {
     return getUsers(val, UsersList);
    };

    $scope.selectUser = function($item, $model, $label) {
     $scope.cloudServiceProviderDetails._user = $item._id;
   };

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
  

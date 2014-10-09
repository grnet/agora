'use strict';

var agoraAppCloudServiceProvidersController =
  angular.module('agoraAppCloudServiceProvidersController', []);

agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProvidersListCtrl', 
  ['$scope', 'CloudServiceProvidersList', 'Utils',
  function($scope, CloudServiceProvidersList, Utils) {

    if (Utils.isAdmin($scope)) {
      $scope.canAdd = true;
    } else {
      $scope.canAdd = false;
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
  'UserSelectCtrl',
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

   $scope.cloudServiceProviderDetails = {
     'name': null,
     'description': null,
     'country': null,
     '_user': null
   };
   
   $scope.update = function() {
     $scope.master = angular.copy($scope.cloudServiceProviderDetails);
     CloudServiceProviderDetails.save({
       cloudServiceProviderId: $scope.cloudServiceProviderDetails._id
       },
       $scope.cloudServiceProviderDetails,
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
    
    $scope.isUnchanged = function() {
      return angular.equals($scope.cloudServiceProviderDetails, $scope.master);
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
      $scope.cloudServiceProviderDetails.cloudServiceProviderUser =
        displayName($scope.cloudServiceProviderDetails._user);
      $scope.master = angular.copy($scope.cloudServiceProviderDetails);
    });
    
    $scope.update = function() {
      $scope.master = angular.copy($scope.cloudServiceProviderDetails);
      CloudServiceProviderDetails.update({
          cloudServiceProviderId: $scope.cloudServiceProviderDetails._id
        },
        $scope.cloudServiceProviderDetails,
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
    
    $scope.isUnchanged = function() {
      return angular.equals($scope.cloudServiceProviderDetails, $scope.master);
    };

    
  }
]);
  

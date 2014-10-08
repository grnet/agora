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

agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderNewCtrl',
  ['$scope', '$rootScope', '$window',
   'CloudServiceProviderDetails', 'UsersList',
   function($scope, $rootScope, $window,
     CloudServiceProviderDetails, UsersList) {

   $scope.getUsers = function(val) {
     return UsersList.query(val);
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
  

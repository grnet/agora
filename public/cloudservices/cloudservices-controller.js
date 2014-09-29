'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller('CloudServicesListCtrl',
  ['$scope', 'CloudServicesList',
  function($scope, CloudServicesList) {
    $scope.cloudServices = CloudServicesList.query();
  }
]);
 
agoraAppCloudServicesController.controller('CriterionCommentCtrl', ['$scope',
  function($scope) {
    if (!$scope.criterion.comment) {
      $scope.noComment = true;
    } else {
      $scope.noComment = false;
    }
    
    $scope.editComment = false;

    $scope.toggleComment = function() {
      if (!$scope.criterion.comment) {
        $scope.noComment = true;
      } else {
        $scope.noComment = false;
      }
    };
  }
]);
  
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
          $rootScope.message = "Profile Updated";
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
  
  

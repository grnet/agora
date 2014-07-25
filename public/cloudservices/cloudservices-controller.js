'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller('CloudServicesListCtrl',
  ['$scope', 'CloudServicesList',
  function($scope, CloudServicesList) {
    $scope.cloudServices = CloudServicesList.query();
  }
]);

agoraAppCloudServicesController.controller('CloudServiceProfileCtrl',
  ['$scope', '$routeParams', '$window', 
   'CloudServiceDetails', 'CloudServiceProfile',
  function($scope, $routeParams, $window, CloudServiceDetails,
    CloudServiceProfile) {
    $scope.cloudServiceDetails = CloudServiceDetails.get();
    $scope.cloudServiceProfile = CloudServiceProfile.get();
      
    $scope.colours = [
      { name: 'Red', value: 0 },
      { name: 'Amber', value: 1 },
      { name: 'Green', value: 2 }
    ];

    $scope.update = function() {
      CloudServiceProfile.update($scope.cloudServiceProfile,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $scope.message = "Profile Updated";
        },
        function(errorResponse) {
          $window.scrollTo(0, 0);
          $scope.cloudServiceProfile = CloudServiceProfile.get();          
          $scope.error = errorResponse.data.error;
        }
      );
    };
  }
]);
  
  

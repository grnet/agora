'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller('CloudServicesListCtrl',
  ['$scope', 'CloudServicesList',
  function($scope, CloudServicesList) {
    $scope.cloudServices = CloudServicesList.query();
  }
]);

agoraAppCloudServicesController.controller('CloudServiceCtrl',
  ['$scope', '$routeParams', '$window', 
   'CloudServiceDetails',
  function($scope, $routeParams, $window, CloudServiceDetails) {
    $scope.cloudServiceDetails = CloudServiceDetails.get();    
      
    $scope.colours = [
      { name: 'Red', value: 0 },
      { name: 'Amber', value: 1 },
      { name: 'Green', value: 2 }
    ];

    $scope.update = function() {
      CloudServiceDetails.update($scope.cloudServiceDetails,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $scope.message = "Profile Updated";
        },
        function(errorResponse) {
          $window.scrollTo(0, 0);
          $scope.cloudServiceProfile = CloudServiceDetails.get();          
          $scope.error = errorResponse.data.error;
        }
      );
    };
  }
]);
  
  

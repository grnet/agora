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
  ['$scope', '$routeParams', 'CloudServiceDetails',
   'CloudServiceProfile',
  function($scope, $routeParams, CloudServiceDetails, CloudServiceProfile) {
    $scope.cloudServiceDetails = CloudServiceDetails.get();
    $scope.cloudServiceProfile = CloudServiceProfile.get();
  }
]);
  
  

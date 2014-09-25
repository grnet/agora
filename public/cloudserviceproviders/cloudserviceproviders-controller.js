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

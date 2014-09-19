'use strict';

var agoraAppCloudServiceProvidersController =
  angular.module('agoraAppCloudServiceProvidersController', []);

agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProvidersListCtrl',
  ['$scope', 'CloudServiceProvidersList',
  function($scope, CloudServiceProvidersList) {
    $scope.response = CloudServiceProvidersList.query();
  }
]);

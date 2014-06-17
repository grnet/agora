'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller('CloudServiceListCtrl',
  ['$scope', 'CloudServiceList',
  function($scope, cloudServiceList) {
    $scope.cloudServices = cloudServiceList.query();
  }
]);

'use strict';

var agoraAppProvidersController =
  angular.module('agoraAppProvidersController', []);

agoraAppProvidersController.controller('ProviderListCtrl',
  ['$scope', 'ProviderList',
  function($scope, ProviderList) {
    $scope.providers = ProviderList.query();
  }
]);

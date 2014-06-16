'use strict';

var agoraAppControllers = angular.module('agoraAppControllers', []);

agoraAppControllers.controller('ProviderListCtrl', ['$scope', 'Provider',
  function($scope, Provider) {
    $scope.providers = Provider.query();
  }
]);

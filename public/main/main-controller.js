'use strict';

var agoraAppMainController =
  angular.module('agoraAppMainController', []);

agoraAppMainController.controller('MainCtrl',
  ['$scope', '$location',
  function($scope, $location, currentPath) {
    $scope.$parent.currentPath = $location.path();
}]);

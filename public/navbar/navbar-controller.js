'use strict';

var agoraAppNavBarController =
  angular.module('agoraAppNavBarController', []);

agoraAppNavBarController.controller('NavBarCtrl',
  ['$scope', '$location',
  function($scope, $location) {

    $scope.navClass = function(target) {
      var basePath = $location.path().substring(1).split("/", 1).pop();
      if (basePath === '') {
        $scope.navBarShow = false;
        return '';
      } else {
        $scope.navBarShow = true;
        return basePath === target ? 'active' : '';
      }
    };
  }
]);

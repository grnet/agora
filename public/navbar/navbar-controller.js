'use strict';

var agoraAppNavBarController =
  angular.module('agoraAppNavBarController', []);

agoraAppNavBarController.controller('NavBarCtrl',
  ['$scope', '$location',
  function($scope, $location) {

    $scope.navClass = function(target) {
      var basePath = $location.path().substring(1).split("/", 1).pop();
      if (basePath === 'login') {
        $scope.navBarShowLogin = false;
        return '';
      } else {
        $scope.navBarShowLogin = true;
        return basePath === target ? 'active' : '';
      }
    };
  }
]);

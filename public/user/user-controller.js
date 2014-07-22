'use strict';

var agoraAppUserController =
  angular.module('agoraAppUserController', []);

agoraAppUserController.controller('UserCtrl',
  ['$scope', '$window', 
  function($scope, $window) {

    $scope.$on('login', function(event, args) {
      signIn();
    });

    var signIn = function() {
      if ($window.sessionStorage.token) {
        $scope.username = $window.sessionStorage.username;
        $scope.firstName = $window.sessionStorage.firstName;
        $scope.surname = $window.sessionStorage.surname;
      }
    };
    
    $scope.signOut = function() {
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.username;
      delete $window.sessionStorage.firstName;
      delete $window.sessionStorage.surname;
      delete $scope.username;
      delete $scope.firstName;
      delete $scope.surname;
    };
    
  }
]);

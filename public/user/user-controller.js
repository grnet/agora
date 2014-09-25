'use strict';

var agoraAppUserController =
  angular.module('agoraAppUserController', []);

agoraAppUserController.controller('UserCtrl',
  ['$scope', '$rootScope', '$window', '$location',
  function($scope, $rootScope, $window, $location) {

    $scope.$on('login', function(event, args) {
      signIn();
    });

    var signIn = function() {
      var user = $window.sessionStorage.getItem('user');
      if (user) {
        $rootScope.user = JSON.parse(user);
      }
    };

    signIn();
    
    $scope.signOut = function() {
      $window.sessionStorage.removeItem('user');
      $window.sessionStorage.removeItem('token');
      delete $rootScope.user;
      $location.path('/');
    };
    
  }
]);

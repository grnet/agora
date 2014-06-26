'use strict';

var agoraAppLoginController =
  angular.module('agoraAppLoginController', []);
  
agoraAppLoginController.controller('LoginCtrl', ['$scope', 'Login',
  function ($scope, Login) {
    $scope.submit = function() {
      Login.login({email: $scope.email, password: $scope.password});
    };
  }]);


'use strict';

var agoraAppLoginController =
  angular.module('agoraAppLoginController', []);
  
agoraAppLoginController.controller('LoginCtrl', ['$scope', '$rootScope',
  '$location', '$window', 'Login',
  function ($scope, $rootScope, $location, $window, Login) {
    $scope.login = function(form) {
      Login.login({username: $scope.username, password: $scope.password},
        function(value, responseHeaders) {
          $window.sessionStorage.token = value.token;
          $window.sessionStorage.firstName = value.firstName;
          $window.sessionStorage.surname = value.surname;
          $window.sessionStorage.username = value.username;
          $rootScope.$broadcast('login', {user: value.username});
          $location.path('/');
        }, 
        function(httpResponse) {
          $scope.error = {};
          $scope.errors = {};

          if (httpResponse.data.errors) {
            var errors = httpResponse.data.errors;
            angular.forEach(errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
            $scope.error.other = httpResponse.data.message;
          }
        });
    };
  }]);


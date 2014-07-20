'use strict';

var agoraAppUserController =
  angular.module('agoraAppUserController', []);

agoraAppUserController.controller('UserCtrl',
  ['$rootScope', '$window', 
  function($rootScope, $window) {
    if ($window.sessionStorage.token) {
      $rootScope.username = $window.sessionStorage.username;
      $rootScope.firstName = $window.sessionStorage.firstName;
      $rootScope.surname = $window.sessionStorage.surname;
    }
    
  }
]);

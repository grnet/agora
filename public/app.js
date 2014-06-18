'use strict';

var agoraApp = angular.module('agoraApp', [
  'ngRoute',
  'agoraAppControllers',
  'agoraAppServices'
]);

agoraApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/providers', {
        templateUrl: 'provider/providers.html',
        controller: 'ProviderListCtrl'
      }).
      otherwise({
          redirectTo: '/providers'
      });
}]);

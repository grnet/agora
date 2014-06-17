'use strict';

var agoraApp = angular.module('agoraApp', [
  'ngRoute',
  'agoraAppProvidersController',
  'agoraAppProvidersService',  
  'agoraAppCloudServicesController',
  'agoraAppCloudServicesService'  
]);

agoraApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/providers', {
        templateUrl: 'providers/providers.html',
        controller: 'ProviderListCtrl'
      }).
      when('/cloudservices', {
        templateUrl: 'cloudservices/cloudservices.html',
        controller: 'CloudServiceListCtrl'
      }).      
      otherwise({
          redirectTo: '/providers'
      });
}]);

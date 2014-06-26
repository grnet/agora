'use strict';

var agoraApp = angular.module('agoraApp', [
  'ngRoute',
  'agoraAppCloudServicesController',
  'agoraAppCloudServicesService',  
  'agoraAppCloudServiceProvidersController',
  'agoraAppCloudServiceProvidersService',
  'agoraAppLoginController',
  'agoraAppLoginService',  
]);

agoraApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      }).
      when('/login', {
          templateUrl: 'login/login.html',
          controller: 'LoginCtrl'
      }).
      when('/providers', {
        templateUrl: 'cloudserviceproviders/providers.html',
        controller: 'CloudServiceProvidersListCtrl'
      }).
      when('/cloudservices/:id', {
        templateUrl: 'cloudservices/cloudservice.html',
        controller: 'CloudServiceProfileCtrl'
      }).      
      when('/cloudservices', {
        templateUrl: 'cloudservices/cloudservices.html',
        controller: 'CloudServicesListCtrl'
      }).
      otherwise({
          redirectTo: '/'
      });
}]);

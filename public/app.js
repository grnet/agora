'use strict';

var agoraApp = angular.module('agoraApp', [
  'ngRoute',
  'ui.bootstrap',
  'agoraAppMainController',
  'agoraAppErrorInterceptor',  
  'agoraAppUserController',
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
        templateUrl: 'main/main.html',
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
        controller: 'CloudServiceCtrl'
      }).
      when('/cloudservices/:id\/edit', {
        templateUrl: 'cloudservices/cloudservice-edit.html',
        controller: 'CloudServiceCtrl'
      }).      
      when('/cloudservices', {
        templateUrl: 'cloudservices/cloudservices.html',
        controller: 'CloudServicesListCtrl'
      }).
      otherwise({
          redirectTo: '/'
      });
}]);

'use strict';

var agoraApp = angular.module('agoraApp', [
  'ngRoute',
  'ui.bootstrap',
  'agoraAppMainController',
  'agoraAppUtilsService',
  'agoraAppErrorInterceptor',
  'agoraAppNavBarController',    
  'agoraAppUsersController',
  'agoraAppUsersService',
  'agoraAppCountriesService',
  'agoraAppCriteriaService',  
  'agoraAppCloudServicesController',
  'agoraAppCloudServicesService',  
  'agoraAppCloudServiceProvidersController',
  'agoraAppCloudServiceProvidersService',
  'agoraAppLoginController',
  'agoraAppLoginService',
  'agoraAppUploadImageDirective'
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
      when('/cloudserviceproviders', {
        templateUrl: 'cloudserviceproviders/cloudserviceproviders.html',
        controller: 'CloudServiceProvidersListCtrl'
      }).
      when('/cloudserviceproviders/new', {
        templateUrl: 'cloudserviceproviders/cloudserviceprovider-edit.html',
        controller: 'CloudServiceProvidersListCtrl'
      }).
      when('/cloudserviceproviders/:id', {
        templateUrl: 'cloudserviceproviders/cloudserviceprovider.html',
        controller: 'CloudServiceProviderCtrl'
      }).
      when('/cloudserviceproviders/:id\/edit', {
        templateUrl: 'cloudserviceproviders/cloudserviceprovider-edit.html',
        controller: 'CloudServiceProviderCtrl'
      }).      
      when('/cloudserviceproviders/new', {
        templateUrl: 'cloudserviceproviders/cloudserviceprovider-edit.html',
        controller: 'CloudServiceProviderNewCtrl'
      }).
      when('/cloudservices/new', {
        templateUrl: 'cloudservices/cloudservice-new.html',
        controller: 'CloudServiceNewCtrl'
      }).      
      when('/cloudservices/:id', {
        templateUrl: 'cloudservices/cloudservice.html',
        controller: 'CloudServiceCtrl'
      }).
      when('/cloudservices/:id\/edit', {
        templateUrl: 'cloudservices/cloudservice-edit.html',
        commentUrl: 'cloudservices/commentmodalcontent.html',
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


'use strict';

var agoraAppCloudServiceProvidersService =
  angular.module('agoraAppCloudServiceProvidersService', ['ngResource']).
  value('version', '0.1.0');

agoraAppCloudServiceProvidersService.factory('CloudServiceProvidersList',
  ['$resource',
   function($resource) {
     return $resource('api/cloudserviceproviders');
  }]);

agoraAppCloudServiceProvidersService.factory('CloudServiceProviderDetails',
  ['$resource',
  function($resource) {
    return $resource('api/cloudserviceproviders/:cloudServiceProviderId', null,
    {
      update: { method: 'PUT' }
    });
  }]);
  

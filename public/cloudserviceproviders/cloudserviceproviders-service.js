'use strict';

var agoraAppCloudServiceProvidersService =
  angular.module('agoraAppCloudServiceProvidersService', ['ngResource']).
  value('version', '0.1.0');

agoraAppCloudServiceProvidersService.factory('CloudServiceProvidersList',
  ['$resource',
   function($resource) {
     return $resource('api/:providers', {}, {
       query: {method:'GET', params:{providers:'providers'}, isArray: true}
     });
  }]);

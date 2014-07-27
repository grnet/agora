'use strict';

var agoraAppCloudServicesService =
  angular.module('agoraAppCloudServicesService', ['ngResource'])
  .value('version', '0.1.0');

agoraAppCloudServicesService.factory('CloudServicesList', ['$resource',
  function($resource) {
    return $resource('api/cloudservices');
  }]);

agoraAppCloudServicesService.factory('CloudServiceDetails',
  ['$resource', '$routeParams',
  function($resource, $routeParams) {
    return $resource('api/cloudservices/:cloudServiceId', {
      cloudServiceId: $routeParams.id
    },
    {
      update: { method: 'PUT' }
    });
  }]);
  
  

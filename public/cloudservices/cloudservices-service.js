'use strict';

var agoraAppCloudServicesService =
  angular.module('agoraAppCloudServicesService', ['ngResource'])
  .value('version', '0.1.0');

agoraAppCloudServicesService.factory('CloudServicesList', ['$resource',
  function($resource) {
    return $resource('api/cloudservices');
  }]);

agoraAppCloudServicesService.factory('CloudServiceDetails',
  ['$resource',
  function($resource) {
    return $resource('api/cloudservices/:cloudServiceId', null,
    {
      update: { method: 'PUT' }
    });
  }]);
  
  

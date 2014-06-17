'use strict';

var agoraAppCloudServicesService =
  angular.module('agoraAppCloudServicesService', ['ngResource'])
  .value('version', '0.1.0');

agoraAppCloudServicesService.factory('CloudServiceList', ['$resource',
  function($resource) {
    return $resource('api/:cloudservices', {}, {
      query: {
        method:'GET',
        params: {
          cloudservices: 'cloudservices'
        },
        isArray:true
      }
    });
  }]);

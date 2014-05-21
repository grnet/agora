'use strict';

var agoraAppServices = angular.module('agoraAppServices', ['ngResource']).
  value('version', '0.1.0');

agoraAppServices.factory('Provider', ['$resource',
  function($resource) {
    return $resource('providers/:providers.json', {}, {
      query: {method:'GET', params:{providers:'providers'}, isArray:true}
    });
  }]);

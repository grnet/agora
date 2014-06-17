'use strict';

var agoraAppProvidersService =
  angular.module('agoraAppProvidersService', ['ngResource']).
  value('version', '0.1.0');

agoraAppProvidersService.factory('ProviderList', ['$resource',
  function($resource) {
    return $resource('api/:providers', {}, {
      query: {method:'GET', params:{providers:'providers'}, isArray:true}
    });
  }]);

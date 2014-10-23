'use strict';

var agoraAppErrorInterceptor =
  angular.module('agoraAppErrorInterceptor', ['ngResource'])
  .value('version', '0.1.0');

agoraAppErrorInterceptor.factory('errorInterceptor',
  function ($rootScope, $q, $window) {
  return {
    response: function(response) {
      if ($rootScope.error) {
        delete $rootScope.error;
      }
      if ($rootScope.message) {
        delete $rootScope.message;
      }
      return response;
    },
    responseError: function(response) {
      if (response.data) {
        $rootScope.error = response.data.message;
      }
      return $q.reject(response);
    }
  };
});

agoraAppErrorInterceptor.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor');
}]);

'use strict';

var agoraAppErrorInterceptor =
  angular.module('agoraAppErrorInterceptor', ['ngResource'])
  .value('version', '0.1.0');

agoraAppErrorInterceptor.factory('errorInterceptor',
  function ($rootScope, $q, $window) {
  return {
    responseError: function(response) {
      if (response.data.error) {
        $rootScope.error = response.data.error.message;
      }
      return $q.reject(response);
    }
  };
});

agoraAppErrorInterceptor.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor');
}]);

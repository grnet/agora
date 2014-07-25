'use strict';

var agoraAppLoginService =
  angular.module('agoraAppLoginService', ['ngResource'])
  .value('version', '0.1.0');

agoraAppLoginService.factory('Login', ['$resource',
  function($resource, username, password) {
    return $resource('api/login', {}, {
      login: {method: 'POST',
      params: {
        username: username, password: password
      }
    }});
  }
]);

agoraAppLoginService.factory('Logout', ['$window',
  function($window) {
    delete $window.sessionStorage.token;
  }
]);

agoraAppLoginService.factory('authInterceptor',
  function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers['x-access-token'] = $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

agoraAppLoginService.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);

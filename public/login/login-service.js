'use strict';

var agoraAppLoginService =
  angular.module('agoraAppLoginService', ['ngResource'])
  .value('version', '0.1.0');

agoraAppLoginService.factory('Login', ['$resource',
  function($resource, email, password) {
    return $resource('api/login', {}, {
      login: {method: 'POST',
      params: {
        email: email, password: password
      }
    }});
  }]);


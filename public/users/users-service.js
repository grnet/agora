'use strict';

var agoraAppUsersService =
  angular.module('agoraAppUsersService', ['ngResource']).
  value('version', '0.1.0');

agoraAppUsersService.factory('UsersList',
  ['$resource',
   function($resource) {
     return $resource('api/users');
  }]);

  

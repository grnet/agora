'use strict';

var agoraAppUtilsService =
  angular.module('agoraAppUtilsService', ['ngResource']).
  value('version', '0.1.0');

agoraAppUtilsService.factory('Utils',
  function() {
    return {
      isAdmin: function(scope) {
        var isAdmin = false;
        if (scope.user && scope.user.groups
            && scope.user.groups.indexOf('admin') != -1) {
          isAdmin = true;
        }
        return isAdmin;
      },
      loggedIn: function(scope) {
        if (scope.user) {
          return true;
        } else {
          return false;
        }
      }
    };
  });


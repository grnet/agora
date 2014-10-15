'use strict';

var agoraAppCriteriaService =
  angular.module('agoraAppCriteriaService', ['ngResource']).
  value('version', '0.1.0');

agoraAppCriteriaService.factory('CriteriaList',
  ['$resource',
   function($resource) {
     return $resource('api/criteria');
  }]);

  

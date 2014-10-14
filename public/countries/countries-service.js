'use strict';

var agoraAppCountriesService =
  angular.module('agoraAppCountriesService', ['ngResource']).
  value('version', '0.1.0');

agoraAppCountriesService.factory('CountriesList',
  ['$resource',
   function($resource) {
     return $resource('api/countries');
  }]);

  

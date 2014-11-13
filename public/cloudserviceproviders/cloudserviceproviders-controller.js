'use strict';

var agoraAppCloudServiceProvidersController =
  angular.module('agoraAppCloudServiceProvidersController', []);

agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProvidersListCtrl', 
  ['$scope', 'CloudServiceProvidersList', 'Utils',
  function($scope, CloudServiceProvidersList, Utils) {

    if (Utils.isAdmin($scope)) {
      $scope.canAdd = true;
    } else {
      $scope.canAdd = false;
    }
    
    $scope.cloudServiceProviders = CloudServiceProvidersList.query();
  }
]);

function displayName(user) {
  return user.username
    + " (" + user.firstName + " " + user.surname
    + " " + user.email + ")";
}
  
agoraAppCloudServiceProvidersController.controller(
  'UserSelectCtrl',
  ['$scope', 'UsersList',
   function($scope, UsersList) {

     $scope.getUsers = function(val) {
       return UsersList.query({term: val}).$promise.then(function(users) {
         return users.map(function(user) {
           user.displayName = displayName(user); 
           return user;
         });
       });
     };

     $scope.selectUser = function($item, $model, $label) {
       $scope.cspDetails._user = $item._id;
     };
     
}]);

agoraAppCloudServiceProvidersController.controller(
  'CountrySelectCtrl',
  ['$scope', 'CountriesList',
   function($scope, CountriesList) {

     $scope.getCountries = function(val) {
       return CountriesList.query({term: val}).$promise
         .then(function(countries) {
           return countries;
         });
     };

     $scope.selectCountry = function($item, $model, $label) {
       $scope.cspDetails._country = $item._id;
       $scope.cspDetails.countryCode = $item.isoCode;
     };
     
}]);
    
agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderNewCtrl',
  ['$scope', '$rootScope', '$window',
   'CloudServiceProviderDetails',
   function($scope, $rootScope, $window, CloudServiceProviderDetails) {

   $scope.cspDetails = {
     'name': null,
     'description': null,
     '_country': null,
     '_user': null
   };
   
   $scope.update = function() {
     $scope.master = angular.copy($scope.cspDetails);
     CloudServiceProviderDetails.save({
       cloudServiceProviderId: $scope.cspDetails._id
       },
       $scope.cspDetails,
         function(value, headers) {
           $window.scrollTo(0, 0);
           $rootScope.message = "Provider saved.";
       },
       function(errorResponse) {
         $window.scrollTo(0, 0);
         $scope.reset();
       }
     );
   };

    $scope.reset = function() {
      $scope.cspDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function() {
      return angular.equals($scope.cspDetails, $scope.master);
    };

}]);

  
agoraAppCloudServiceProvidersController.controller(
  'CloudServiceProviderCtrl',
  ['$scope', '$rootScope', '$routeParams', '$window',
   'CloudServiceProviderDetails', 'Utils',
  function($scope, $rootScope, $routeParams, $window,
    CloudServiceProviderDetails, Utils) {

    if (Utils.isAdmin($scope)) {
      $scope.canEdit = true;
    } else {
      $scope.canEdit = false;
    }
    
    $scope.cspDetails =
      CloudServiceProviderDetails.get({
        cloudServiceProviderId: $routeParams.id
      });
    
    $scope.cspDetails.$promise.then(function() {
      $scope.cspDetails.cloudServiceProviderUser =
        displayName($scope.cspDetails._user);
      $scope.cspDetails.cloudServiceProviderCountry =
        $scope.cspDetails._country;
      $scope.cspDetails.countryCode = $scope.cspDetails._country.isoCode;
      $scope.master = angular.copy($scope.cspDetails);
    });
    
    $scope.update = function() {
      $scope.master = angular.copy($scope.cspDetails);
      CloudServiceProviderDetails.update({
          cloudServiceProviderId: $scope.cspDetails._id
        },
        $scope.cspDetails,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $rootScope.message = "Provider updated.";
        },
        function(errorResponse) {
          $window.scrollTo(0, 0);
          $scope.reset();
        }
      );
    };

    $scope.reset = function() {
      $scope.cspDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function() {
      return angular.equals($scope.cspDetails, $scope.master);
    };

    
  }
]);
  

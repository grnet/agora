'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller(
  'AddCountryCtrl',
  ['$scope', 'CountriesList',
   function($scope, CountriesList) {

     $scope.getCountries = function(val) {
       return CountriesList.query({term: val}).$promise
         .then(function(countries) {
           return countries;
         });
     };

     $scope.addCountry = function($item, $model, $label) {
       if ($scope.cloudServiceDetails.countries.indexOf($item._id) == -1) {
         $scope.cloudServiceDetails.countries.push($item);
         $scope.cloudServiceDetails.cloudServiceCountry = '';
       }
     };
     
}]);
  
agoraAppCloudServicesController.controller('CloudServicesListCtrl',
  ['$scope', 'CloudServicesList', 'CriteriaList', 'Utils',
  function($scope, CloudServicesList, CriteriaList, Utils) {

    if (Utils.isAdmin($scope)) {
      $scope.canAdd = true;
    } else {
      $scope.canAdd = false;
    }

    $scope.loggedIn = Utils.loggedIn($scope);

    $scope.cloudServices = CloudServicesList.query();
    $scope.criteria = {};
    CriteriaList.query()
      .$promise.then(function(criteria) {
        criteria.forEach(function(criterion) {
          $scope.criteria[criterion._id] = {
            label: criterion.label,
            name: criterion.name
          };
        });
      });
  }
]);

agoraAppCloudServicesController.controller(
  'CloudServiceProviderSelectCtrl',
  ['$scope', 'CloudServiceProvidersList',
   function($scope, CloudServiceProvidersList) {

     $scope.getCloudServiceProviders = function(val) {
       return CloudServiceProvidersList.query({term: val})
         .$promise.then(function(cloudServices) {
           return cloudServices;
         });
     };

     $scope.selectCloudServiceProvider = function($item, $model, $label) {
       $scope.cloudServiceDetails._cloudServiceProvider = $item._id;
     };
     
}]);

var cloudServiceDetailsCtrl = 
agoraAppCloudServicesController.controller(
  'CloudServiceNewCtrl',
  ['$scope', '$rootScope', '$window', 'CloudServiceDetails',
   function($scope, $rootScope, $window, CloudServiceDetails) {

    $scope.cloudServiceDetails = {
      'name': null,
      'description': null,
      'longDescription': null,
      '_cloudServiceProvider': null
    };

   $scope.update = function() {
     $scope.master = angular.copy($scope.cloudServiceDetails);
     CloudServiceDetails.save({},
       $scope.cloudServiceDetails,
         function(value, headers) {
           $window.scrollTo(0, 0);
           $rootScope.message = "Service saved.";
       },
       function(errorResponse) {
         $window.scrollTo(0, 0);
         $scope.reset();
       }
     );
   };

    $scope.reset = function() {
      $scope.cloudServiceDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function() {
      return angular.equals($scope.cloudServiceDetails, $scope.master);
    };

}]);
  
agoraAppCloudServicesController.controller('CommentModalCtrl',
  ['$scope', '$route', '$modal', '$log', 
  function($scope, $route, $modal, $log) {

  $scope.openCommentModal = function(size) {

    var modalInstance = $modal.open({
      templateUrl: $route.current.commentUrl,
      controller: 'CommentModalInstanceCtrl',
      size: size,
      resolve: {
        criterionLabel: function() {
          return $scope.rating._criterion.label;
        },
        commentText: function() {
          return $scope.rating.comment;
        }
      }
    });

    modalInstance.result.then(function(commentText) {
      $scope.rating.comment = commentText;
    });
  };
  
}]);

// Please note that $modalInstance represents a modal window
// (instance) dependency. It is not the same as the $modal service
// used above.

agoraAppCloudServicesController.controller('CommentModalInstanceCtrl',
  ['$scope', '$modalInstance', 'criterionLabel', 'commentText',
  function ($scope, $modalInstance, criterionLabel, commentText) {

  $scope.criterionLabel = criterionLabel;
  $scope.commentText = commentText;
  
  $scope.ok = function(commentText) {
    $modalInstance.close(commentText);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
  
}]);
  
agoraAppCloudServicesController.controller('CloudServiceCtrl',
  ['$scope', '$rootScope', '$routeParams', '$window', '$location',
  '$anchorScroll',
  'CloudServiceDetails', 'Utils',
  function($scope, $rootScope, $routeParams, $window, $location,
    $anchorScroll, CloudServiceDetails, Utils) {
    $scope.cloudServiceDetails =
      CloudServiceDetails.get({ cloudServiceId: $routeParams.id });    
      
    $scope.colours = [
      { label: 'Green', value: 0 },
      { label: 'Amber', value: 1 },
      { label: 'Red', value: 2 }
    ];

    $scope.processingStatuses = [
      { label: 'draft', value: 0 },
      { label: 'submitted', value: 1 },
      { label: 'published', value: 2 }
    ];

    $scope.$evalAsync(function() {
      if ($location.hash()) {
        $anchorScroll();
      }
    });
      
    $scope.showDescriptions = {};

    $scope.isExpanded = false;

    $scope.canEdit = false;
    $scope.enableAddCountry = false;
    
    $scope.cloudServiceDetails.$promise.then(function() {
      if (!$scope.cloudServiceDetails.countries) {
        $scope.cloudServiceDetails.countries = [];
      }
      $scope.cloudServiceDetails.ratings.forEach(function(rating) {
        $scope.showDescriptions[rating._criterion.name] = false;
      });
      $scope.master = angular.copy($scope.cloudServiceDetails);
      var isAdmin = Utils.isAdmin($scope);
      var provider = $scope.cloudServiceDetails._cloudServiceProvider;
      if (isAdmin) {
        $scope.canEdit = true;
      } else if (provider._user == $rootScope.user._id) {
        $scope.processingStatuses.pop();
        if ($scope.cloudServiceDetails.processingStatus == 0) {
          $scope.canEdit = true;
        }
      }
    });

    $scope.toggleCriterion = function(rating) {
      $scope.showDescriptions[rating._criterion.name] =
        !$scope.showDescriptions[rating._criterion.name];
    };

    $scope.toggleExpand = function() {
      var key = null;
      $scope.isExpanded = !$scope.isExpanded;
      if ($scope.isExpanded) {
        for (key in $scope.showDescriptions) {
          if (!$scope.showDescriptions.hasOwnProperty(key)) {
            continue;
          }
          $scope.showDescriptions[key] = true;
        };
      } else {
        for (key in $scope.showDescriptions) {
          if (!$scope.showDescriptions.hasOwnProperty(key)) {
            continue;
          }
          $scope.showDescriptions[key] = false;
        };
      }
    };
    
    $scope.update = function(cloudServiceDetails) {
      $scope.master = angular.copy(cloudServiceDetails);
      CloudServiceDetails.update({
          cloudServiceId: cloudServiceDetails._id
        },
        cloudServiceDetails,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $rootScope.message = "Profile updated.";
        },
        function(errorResponse) {
          $window.scrollTo(0, 0);
          $scope.reset();
        }
      );
    };

    $scope.reset = function() {
      $scope.cloudServiceDetails = angular.copy($scope.master);
    };
    
    $scope.isUnchanged = function(cloudServiceDetails) {
      return angular.equals(cloudServiceDetails, $scope.master);
    };

    $scope.removeCountry = function(country) {
      var i = 0;
      for (i = 0; i < $scope.cloudServiceDetails.countries.length; i++) {
        if ($scope.cloudServiceDetails.countries[i]._id == country._id) {
          $scope.cloudServiceDetails.countries.splice(i, 1);
          return;
        }
      }
    };

    $scope.getCriterionName = function(criterion, last) {
      if (last) {
          $anchorScroll();
      }
      return criterion.name;
    };    
  }
]);

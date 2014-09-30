'use strict';

var agoraAppCloudServicesController =
  angular.module('agoraAppCloudServicesController', []);

agoraAppCloudServicesController.controller('CloudServicesListCtrl',
  ['$scope', 'CloudServicesList',
  function($scope, CloudServicesList) {
    $scope.cloudServices = CloudServicesList.query();
  }
]);
 
agoraAppCloudServicesController.controller('CriterionCommentCtrl', ['$scope',
  function($scope) {
    if (!$scope.criterion.comment) {
      $scope.noComment = true;
    } else {
      $scope.noComment = false;
    }
    
    $scope.editComment = false;

    $scope.toggleComment = function() {
      if (!$scope.criterion.comment) {
        $scope.noComment = true;
      } else {
        $scope.noComment = false;
      }
    };
  }
]);

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
          return $scope.criterion.label;
        },
        commentText: function() {
          return $scope.criterion.comment;
        }
      }
    });

    modalInstance.result.then(function(commentText) {
      $scope.criterion.comment = commentText;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
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
  ['$scope', '$rootScope', '$routeParams', '$window', 
   'CloudServiceDetails',
  function($scope, $rootScope, $routeParams, $window, CloudServiceDetails) {
    $scope.cloudServiceDetails =
      CloudServiceDetails.get({ cloudServiceId: $routeParams.id });    
      
    $scope.colours = [
      { name: 'Red', value: 0 },
      { name: 'Amber', value: 1 },
      { name: 'Green', value: 2 }
    ];

    $scope.nameEdit = false;
    $scope.descriptionEdit = false;

    $scope.canEdit = false;

    $scope.cloudServiceDetails.$promise.then(function() {
      $scope.master = angular.copy($scope.cloudServiceDetails);
      var isAdmin = $rootScope.user.groups.indexOf('admin') != -1;
      var provider = $scope.cloudServiceDetails._cloudServiceProvider;
      if (isAdmin || provider._user.equals($rootScope.user._id)) {
        $scope.canEdit = true;
      }
    });
    
    $scope.update = function(cloudServiceDetails) {
      $scope.nameEdit = false;
      $scope.descriptionEdit = false;    
      $scope.master = angular.copy(cloudServiceDetails);
      CloudServiceDetails.update({
          cloudServiceId: cloudServiceDetails._id
        },
        cloudServiceDetails,
        function(value, headers) {
          $window.scrollTo(0, 0);
          $rootScope.message = "Profile Updated";
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
    
  }
]);
  
  

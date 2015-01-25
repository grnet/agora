'use strict';

var uploadImage = angular.module('agoraAppUploadImageDirective', []);

uploadImage.directive('agoraUploadImage', function ($parse) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      image: '='
    },
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.agoraUploadImage);
            
      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();
                
        reader.onload = function(onLoadEvent) {
          scope.image = onLoadEvent.target.result;
          scope.$apply();
        };
        
        reader.readAsDataURL((onChangeEvent.srcElement
          || onChangeEvent.target).files[0]);
      });
    }
  };
});

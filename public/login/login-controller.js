'use strict';

var agoraAppLoginController =
  angular.module('agoraAppLoginController', []);
  
agoraAppLoginController.controller('LoginCtrl', ['$scope', '$rootScope',
  '$location', '$window', 'Login',
  function ($scope, $rootScope, $location, $window, Login) {

  // $window.DiscoJuice.Hosted.setup({
  //   target: "#edugain-login",
  //   title: "GÉANT Cloud Service Catalogue",
  //   spentityid: "https://bridge.uninett.no/saml2/entityid",
  //   responseurl: "http://bridge.uninett.no/response.html",
  //   redirectURL: "http://bridge.uninett.no/login?idp=",
  //   feeds: ["edugain", "kalmar", "feide"]
  // });
  
  $scope.login = function(form) {
    Login.login({username: $scope.username, password: $scope.password},
      function(value, responseHeaders) {
        var token = value.token;
        delete value.token;
        $window.sessionStorage.setItem('user', JSON.stringify(value));
        $window.sessionStorage.setItem('token', token);
        $rootScope.$broadcast('login');
        $location.path('/');
      }, 
      function(httpResponse) {
        $scope.error = {};
        $scope.errors = {};

        if (httpResponse.data.errors) {
          var errors = httpResponse.data.errors;
          angular.forEach(errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        $scope.error.other = httpResponse.data.message;
        }
      });
    };
}]);


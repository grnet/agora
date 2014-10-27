'use strict';

var agoraAppLoginController =
  angular.module('agoraAppLoginController', []);
  
agoraAppLoginController.controller('LoginCtrl', ['$scope', '$rootScope',
  '$location', '$window', 'Login',
  function ($scope, $rootScope, $location, $window, Login) {

  var djc = $window.DiscoJuice.Hosted.getConfig({
    target: "#edugain-login",
    title: "GÉANT Cloud Service Catalogue",
    spentityid: "https://127.0.0.1:8081/saml2/entityid",
    responseurl: "https://127.0.0.1:8081/api/login/callback",
    redirectURL: "https://127.0.0.1:8081/api/login/saml?idp=",
    feeds: ["edugain", "kalmar", "feide"]
  });

  djc.inlinemetadata = [
    {
      'entityID': 'https://openidp.feide.no',
      'title': 'OpenIdP',
      'icon': 'openidp.png',
      'descr':'If you do not have an institutional account, register here.',
      'country':'_all_',
      'geo':null,
      'weight':-5,
      'keywords': ['Guest', 'OpenIdP', 'Orphanage', 'Homeless',
        'Create Account', 'Register']
    }
  ];

  $("#edugain-login").DiscoJuice(djc);
  
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


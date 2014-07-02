describe('Agora controllers', function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('agoraApp'));
  beforeEach(module('agoraAppLoginService'));

  describe('LoginCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectPOST('api/login', {username: 'foo', password: 'bar'}).
        respond({'errors': {
          'username': {
            'message': 'No user found.'}
          }
        });

      scope = $rootScope.$new();
      ctrl = $controller('LoginCtrl', {$scope: scope});
    }));

    it('should fail to login with username "foo" and password "bar"',
      function() {
        scope.username = 'foo';
        scope.password = 'bar';
        scope.loginForm = { 
          username: {},
        };
        scope.loginForm['username'].$setValidity = function() {};        
        scope.login(scope.loginForm);
        $httpBackend.flush();
        expect(scope.errors['username']).toEqualData('No user found.');
      });

  });

});

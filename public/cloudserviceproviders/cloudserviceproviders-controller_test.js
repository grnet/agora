describe('Agora controllers', function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('agoraApp'));
  beforeEach(module('agoraAppCloudServiceProvidersService'));

  describe('CloudServiceProvidersListCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('api/providers').
        respond({
            cloudServiceProviders: [{name: 'GRNET'}, {name: 'GEANT'}],
            canAdd: false
        });

      scope = $rootScope.$new();
      ctrl = $controller('CloudServiceProvidersListCtrl', {$scope: scope});
    }));

    it('should create "providers" model with 2 providers fetched from xhr',
      function() {
        $httpBackend.flush();
        expect(scope.response.cloudServiceProviders).toEqualData(
          [{name: 'GRNET'}, {name: 'GEANT'}]);
      });

  });

});

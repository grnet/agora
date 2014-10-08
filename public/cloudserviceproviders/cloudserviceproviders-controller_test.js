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
      $httpBackend.expectGET('api/cloudserviceproviders').
        respond([{name: 'GRNET'}, {name: 'GEANT'}]);

      scope = $rootScope.$new();
      ctrl = $controller('CloudServiceProvidersListCtrl', {$scope: scope});
    }));

    it('should create "providers" model with 2 providers fetched from xhr',
      function() {
        expect(scope.cloudServiceProviders).toEqualData([]);
        $httpBackend.flush();
        expect(scope.cloudServiceProviders).toEqualData(
          [{name: 'GRNET'}, {name: 'GEANT'}]);
      });

  });

});

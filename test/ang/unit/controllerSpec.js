describe('Agora controllers', function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('agoraApp'));
  beforeEach(module('agoraAppServices'));

  describe('ProviderListCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('providers/providers.json').
        respond([{name: 'GRNET'}, {name: 'GEANT'}]);

      scope = $rootScope.$new();
      ctrl = $controller('ProviderListCtrl', {$scope: scope});
    }));

    it('should create "providers" model with 2 providers fetched from xhr',
      function() {
        expect(scope.providers).toEqualData(
          [{name: 'GRNET'}, {name: 'GEANT'}]);
      });

  });

});

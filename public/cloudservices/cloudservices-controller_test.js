describe('Agora controllers', function() {

  beforeEach(function() {
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('agoraApp'));
  beforeEach(module('agoraAppCloudServicesService'));

  describe('CloudServiceListCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('api/cloudservices').
        respond([{name: 'GRNET'}, {name: 'GEANT'}]);

      scope = $rootScope.$new();
      ctrl = $controller('CloudServiceListCtrl', {$scope: scope});
    }));

    it('should create "cloudservices" model with 2 cloudservices '
       + 'fetched from xhr',
      function() {
        expect(scope.cloudServices).toEqualData([]);
        $httpBackend.flush();
        expect(scope.cloudServices).toEqualData(
          [{name: 'GRNET'}, {name: 'GEANT'}]);
      });

  });

});

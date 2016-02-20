(function() {
  'use strict';

  describe('FeatCtrl tests', function() {

    var scope,
      state,
      mdMedia,
      httpBackend,
      controller;

    beforeEach(function() {
      module('prodocs');
    });


    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      controller = $controller('FeatCtrl', {
        $scope: scope
      });
      state = $injector.get('$state');
      mdMedia = $injector.get('$mdMedia');

      httpBackend = $injector.get('$httpBackend');
      httpBackend
        .whenGET('/api/session')
        .respond(200, [{
          res: 'res'
        }]);
      httpBackend
        .whenGET('views/home.html')
        .respond(200, [{
          res: 'res'
        }]);
      scope.$digest();
    }));

    it('should call initialize the controller', function() {
      expect(scope.features).toBeDefined();
      scope.init();
      expect(scope.bigScreen).toBeDefined();
    });

    it('should watch the screen size', function() {
      scope.$digest();
      expect(scope.bigScreen).toBeDefined();
    });

    it('should have defined features', function() {
      expect(scope.features).toBeDefined();
    });

  });

})();

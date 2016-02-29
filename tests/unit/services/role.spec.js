(function() {
  'use strict';

  describe('Roles Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Roles,
      error, response,
      httpBackend, cb,
      $resource;
    beforeEach(inject(function($injector) {
      Roles = $injector.get('Roles');
      $resource = $injector.get('$resource');
      Roles.update();
      httpBackend = $injector.get('$httpBackend');

      cb = function(err, res) {
        if (err) {
          error = err;
          response = null;
        } else {
          error = null;
          response = res;
        }
      };

      httpBackend
        .whenGET('views/home.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/feature.html')
        .respond(200, [{
          res: 'res'
        }]);

    }));

    describe('Roles unit tests', function() {
      it('update should be a function', function() {
        expect(Roles.update).toBeDefined();
        expect(typeof Roles.update).toBe('function');
      });
    });
  });

})();

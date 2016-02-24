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
      spyOn(Roles, 'update').and.returnValue();
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
        expect(Roles.update).toHaveBeenCalled();
        expect(typeof Roles.update).toBe('function');
      });

      it('should get roles count', function() {

        httpBackend
          .whenGET('/api/rolecount')
          .respond(200, {
            data: 2
          });

        Roles.count(cb);

        httpBackend.flush();

        expect(error).toBe(null);
        expect(response).toBeDefined();
      });

      it('should return error getting roles count', function() {

        httpBackend
          .whenGET('/api/rolecount')
          .respond(400, {
            err: 'err'
          });

        Roles.count(cb);

        httpBackend.flush();

        expect(response).toBe(null);
        expect(error.data.err).toBe('err');
      });
    });
  });

})();

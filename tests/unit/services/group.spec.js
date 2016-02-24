(function() {
  'use strict';

  describe('Groups Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Groups,
      error, response,
      httpBackend, cb,
      $resource;

    beforeEach(inject(function($injector) {
      Groups = $injector.get('Groups');
      $resource = $injector.get('$resource');
      spyOn(Groups, 'update').and.returnValue(true);
      Groups.update();

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

    describe('Groups unit tests', function() {

      it('update should be a function', function() {
        expect(Groups.update).toBeDefined();
        expect(Groups.update).toHaveBeenCalled();
        expect(typeof Groups.update).toBe('function');
      });

      it('should get group count', function() {

        httpBackend
          .whenGET('/api/groupcount')
          .respond(200, {
            data: 2
          });

        Groups.count(cb);

        httpBackend.flush();

        expect(error).toBe(null);
        expect(response).toBeDefined();
      });

      it('should return error getting group count', function() {

        httpBackend
          .whenGET('/api/groupcount')
          .respond(400, {
            err: 'err'
          });

        Groups.count(cb);

        httpBackend.flush();

        expect(response).toBe(null);
        expect(error.data.err).toBe('err');
      });
    });

  });

})();

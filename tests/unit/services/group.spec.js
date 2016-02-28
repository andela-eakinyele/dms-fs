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
        expect(typeof Groups.update).toBe('function');
      });
    });

  });

})();

(function() {
  'use strict';

  describe('Counts Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Counts,
      error, response,
      cb,
      $resource;

    beforeEach(inject(function($injector) {
      Counts = $injector.get('Counts');
      $resource = $injector.get('$resource');

      cb = function(err, res) {
        if (err) {
          error = err;
          response = null;
        } else {
          error = null;
          response = res;
        }
      };

    }));

    describe('Counts unit tests', function() {

      it('update should be a function', function() {
        expect(Counts).toBeDefined();
      });
    });

  });

})();

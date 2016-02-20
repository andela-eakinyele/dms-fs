(function() {
  'use strict';

  describe('Groups Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Groups,
      $resource;

    beforeEach(inject(function($injector) {
      Groups = $injector.get('Groups');
      $resource = $injector.get('$resource');
      spyOn(Groups, 'update').and.returnValue();
      Groups.update();
    }));

    describe('Groups unit tests', function() {

      it('update should be a function', function() {
        expect(Groups.update).toBeDefined();
        expect(Groups.update).toHaveBeenCalled();
        expect(typeof Groups.update).toBe('function');
      });
    });

  });

})();

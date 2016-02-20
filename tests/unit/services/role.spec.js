(function() {
  'use strict';

  describe('Roles Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Roles,
      $resource;
    beforeEach(inject(function($injector) {
      Roles = $injector.get('Roles');
      $resource = $injector.get('$resource');
      spyOn(Roles, 'update').and.returnValue();
      Roles.update();
    }));

    describe('Roles unit tests', function() {
      it('update should be a function', function() {
        expect(Roles.update).toBeDefined();
        expect(Roles.update).toHaveBeenCalled();
        expect(typeof Roles.update).toBe('function');
      });
    });
  });

})();

(function() {
  'use strict';

  describe('Auth Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Auth,
      Token;
    beforeEach(inject(function($injector) {
      Auth = $injector.get('Auth');
      Token = $injector.get('Token');
    }));

    describe('Auth unit tests', function() {

      it('setToken should be a function', function() {
        expect(Auth.setToken).toBeDefined();
        expect(typeof Auth.setToken).toBe('function');
      });

      it('setToken should call Token.set', function() {
        spyOn(Token, 'set').and.callThrough();
        Auth.setToken('mine', 1);
        expect(Token.set).toHaveBeenCalled();
        expect(Token.get().length).toBe(2);
      });

      it('logout should be a function and be defined', function() {
        expect(Auth.logout).toBeDefined();
        expect(typeof Auth.logout).toBe('function');
      });

      it('logout should call Token.remove', function() {
        spyOn(Token, 'remove').and.callThrough();
        Auth.logout();
        expect(Token.remove).toHaveBeenCalled();
      });
    });
  });

})();

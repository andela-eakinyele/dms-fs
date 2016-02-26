(function() {
  'use strict';

  describe('AdminRoleCtrl tests', function() {

    var scope,
      sampleRole = [{
        _id: 1,
        title: 'a',
        users: [1, 2]
      }, {
        _id: 2,
        title: 'b',
        users: [1, 2]
      }, {
        _id: 3,
        title: 'c',
        users: [1, 2]
      }],

      Roles = {
        save: function(data, successCallback, errorCallback) {
          return (data[0].title !== '') ?
            successCallback(data) : errorCallback(false);
        },

        update: function(params, data, successCallback, errorCallback) {
          return (params.id && data) ?
            successCallback(data) : errorCallback(false);
        },

        get: function(params, successCallback, errorCallback) {
          return params.groupid ? successCallback({
            data: {
              _id: 1,
              title: 'a',
              users: [1, 2]
            }
          }) : errorCallback({
            error: 'error'
          });
        },

        query: function(params, successCallback, errorCallback) {
          if (params.groupid) {
            if (successCallback) {
              return successCallback(sampleRole);
            } else {
              return sampleRole;
            }
          } else {
            if (errorCallback) {
              return errorCallback({
                error: 'error'
              });
            } else {
              return {
                error: 'error'
              };
            }
          }
        }
      },

      state,
      stateParams,
      Utils,
      controller;

    beforeEach(function() {
      module('prodocs');
    });


    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      controller = $controller('AdminRoleCtrl', {
        $scope: scope,
        Roles: Roles
      });

      state = $injector.get('$state');
      Utils = $injector.get('Utils');
      stateParams = $injector.get('$stateParams');

    }));

    describe('Helper scope functions for adding roles', function() {

      it('should return a new array', function() {
        var newArr = scope.range(2);
        expect(newArr).toBeDefined();
      });

      it('should increase scope value', function() {
        expect(scope.num).toBe(0);
        scope.increase();
        expect(scope.num).toBe(1);
      });

      it('should decrease scope value', function() {
        scope.num = 1;
        scope.decrease();
        expect(scope.num).toBe(0);
      });

      it('should enable create button', function() {
        var list = ['Editor', ' Publisher'];
        var enabled = scope.enableCreateButton(list);
        expect(enabled).toBeTruthy();
      });

      it('should disable create button', function() {
        var list = [' ', ' '];
        var disabled = scope.enableCreateButton(list);
        expect(disabled).toBeFalsy();
      });

    });

    describe('Creating role(s)', function() {

      it('should create a new role', function() {
        spyOn(Roles, 'save').and.callThrough();
        spyOn(scope, 'cancelAdd').and.callThrough();
        spyOn(state, 'go').and.callThrough();
        stateParams.groupid = 1;
        scope.newRoles = ['Editor', '  '];
        scope.create('ev');
        expect(scope.saveRoles).toBeDefined();
        expect(scope.cancelAdd).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalled();
      });

      it('should alert error creating a new role', function() {
        spyOn(Roles, 'save').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        spyOn(state, 'go').and.callThrough();
        stateParams.groupid = 1;
        scope.newRoles = [' '];
        scope.create('ev');
        expect(scope.saveRoles).toBeDefined();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(state.go).not.toHaveBeenCalled();
      });

      it('should clear role list and scope variable num', function() {
        scope.newRoles = ['Editor', ' Publisher'];
        scope.cancelAdd();
        expect(scope.newRoles.length).toBe(0);
        expect(scope.num).toBe(0);
      });

    });

  });

})();

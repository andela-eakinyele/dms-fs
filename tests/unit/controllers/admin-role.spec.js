describe('AdminRoleCtrl tests', function() {
  'use strict';
  var scope,
    Roles = {
      save: function(data, cb, cbb) {
        return (data[0].title !== '') ? cb(data) : cbb(false);
      },
      update: function(params, data, cb, cbb) {
        return (params.id && data) ? cb(data) : cbb(false);
      },
      get: function(params, cb, cbb) {
        return params.id ? cb({
          message: 'I am groot',
          data: [1, 3, 4]
        }) : cbb({
          message: 'error'
        });
      },
      bulkDelete: function(arr, cb) {
        return (arr.length) ?
          cb(null, 'deleted') : cb('error', null);
      },
      query: function(params, cb, cbb) {
        return (params.groupid) ?
          cb([{
            message: 'I am groot',
            data: [1, 3, 4]
          }]) : cbb('error');
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

  it('should load group roles', function() {
    spyOn(Roles, 'query').and.callThrough();
    stateParams.groupid = 2;
    scope.loadRoles();
    expect(Roles.query).toHaveBeenCalled();
    expect(scope.roles).toBeDefined();
  });

  it('should return a new array', function() {
    var newArr = scope.range(2);
    expect(newArr).toBeDefined();
  });

  it('should increase scope value', function() {
    scope.num = 0;
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

  it('should create a new role', function() {
    spyOn(Roles, 'save').and.callThrough();
    spyOn(scope, 'loadRoles').and.callThrough();
    spyOn(scope, 'cancelAdd').and.callThrough();
    stateParams.groupid = 1;
    scope.newRoles = ['Editor', '  '];
    scope.create('ev');
    expect(scope.saveRoles).toBeDefined();
    expect(scope.loadRoles).toHaveBeenCalled();
    expect(scope.cancelAdd).toHaveBeenCalled();
  });

  it('should alert error creating a new role', function() {
    spyOn(Roles, 'save').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    stateParams.groupid = 1;
    scope.newRoles = [' '];
    scope.create('ev');
    expect(scope.saveRoles).toBeDefined();
    expect(Utils.showAlert).toHaveBeenCalled();
  });

  it('should clear role list and scope variable num', function() {
    scope.newRoles = ['Editor', ' Publisher'];
    scope.cancelAdd();
    expect(scope.newRoles.length).toBe(0);
    expect(scope.num).toBe(0);
  });

  it('should remove role', function() {
    var list = ['Editor', ' Publisher'];
    var item = 'Editor';
    scope.toggle(item, list);
    expect(list.length).toBe(1);
  });

  it('should add role', function() {
    var list = ['Editor'];
    var item = 'Publisher';
    scope.toggle(item, list);
    expect(list.length).toBe(2);
  });

  it('should delete roles', function() {
    spyOn(Roles, 'bulkDelete').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    spyOn(scope, 'loadRoles').and.callThrough();
    scope.editRoles = [{
      _id: 1
    }, {
      _id: 2
    }];
    scope.deleteRoles('ev');
    expect(scope.loadRoles).toHaveBeenCalled();
    expect(scope.editRoles.length).toBe(0);
    expect(Utils.showAlert).toHaveBeenCalled();
  });

  it('should not delete roles', function() {
    spyOn(Roles, 'bulkDelete').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    spyOn(scope, 'loadRoles').and.callThrough();
    scope.editRoles = false;
    scope.deleteRoles('ev');
    expect(scope.loadRoles).not.toHaveBeenCalled();
    expect(Utils.showAlert).toHaveBeenCalled();
  });

  it('should cancel delete action', function() {
    scope.editRoles = [{
      _id: 1
    }, {
      _id: 2
    }];
    scope.cancelEdit();
    expect(scope.editRoles.length).toBe(0);
  });
});

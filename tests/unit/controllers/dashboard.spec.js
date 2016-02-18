describe('DashBoardCtrl tests', function() {
  'use strict';
  var scope,
    Roles = {
      save: function(data, cb, cbb) {
        (data[0].title !== '') ? cb(data): cbb(false);
      },
      update: function(id, data, cb, cbb) {
        (id && data) ? cb(data): cbb(false);
      },
      get: function(id, cb, cbb) {
        id ? cb({
          message: 'I am groot',
          data: [1, 3, 4]
        }) : cbb({
          message: 'error'
        });
      },
      bulkDelete: function(arr, cb) {
        (arr instanceof Array) ?
        cb(null): cb('error');
      },
      query: function(id, cb) {
        if (id) {
          cb([{
            message: 'I am groot',
            data: [1, 3, 4]
          }]);
        } else {
          cb('error');
        }
      }
    },
    Docs = {
      save: function(data, cb, cbb) {
        data ? cb(data) : cbb(false);
      },
      update: function(id, data, cb, cbb) {
        (id && data) ? cb(data): cbb(false);
      },
      get: function(id, cb, cbb) {
        id ? cb({
          message: 'I am groot',
          data: [1, 3, 4]
        }) : cbb({
          message: 'error'
        });
      },
      query: function(cb, cbb) {
        cb([{
          message: 'I am groot',
          data: [1, 3, 4]
        }]);
        cbb('error');
      }
    },
    user = {
      _id: 1,
      groupId: [{
        _id: 3
      }],
      roles: [{
        _id: 2,
        groupId: [1]
      }]
    },
    Token = {
      get: function() {
        return [{
          token: 'asdfgh'
        }, 1];
      }
    },
    mdSidenav,
    state,
    stateParams,
    Utils,
    Auth,
    controller;

  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('DashBoardCtrl', {
      $scope: scope,
      Docs: Docs,
      Roles: Roles,
      Token: Token
    });
    state = $injector.get('$state');
    stateParams = $injector.get('$stateParams');
    Utils = $injector.get('Utils');
    Auth = $injector.get('Auth');

    // $provide.factory('$mdSidenav', function() {
    //   return function(dir) {
    //     return {
    //       toggle: function() {
    //         return jasmine.createSpy();
    //       },
    //       close: function() {
    //         return jasmine.createSpy();
    //       }
    //     };
    //   };
    // });


  }));

  it('should initialize the controller', function() {
    scope.activeUser = user;
    stateParams.groupid = 1;
    spyOn(Docs, 'query').and.callThrough();
    scope.init();
    expect(scope.updateForm).toBeDefined();
    expect(scope.activeGroup).toBeDefined();
    expect(scope.userRole).toBeDefined();
    expect(Docs.query).toHaveBeenCalled();
    expect(scope.allDocs).toBeDefined();
  });

  it('should redirect to login if no active user', function() {
    spyOn(state, 'go');
    scope.activeUser = null;
    scope.init();
    expect(state.go).toHaveBeenCalledWith('home.login');
  });


  it('should select a user group', function() {
    spyOn(Auth, 'setToken').and.callThrough();
    spyOn(Token, 'get').and.callThrough();
    spyOn(state, 'go');
    scope.activeUser = user;
    scope.toggle(2);
    expect(scope.activeGroup).toBe(2);
    expect(Auth.setToken).toHaveBeenCalled();

    expect(Token.get).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
  });

  it('should check group', function() {
    stateParams.groupid = 2
    var checked = scope.isSelected(2)
    expect(checked).toBeTruthy();
  });

  it('should load modal for user profile update', function() {
    spyOn(Utils, 'custom').and.callThrough();
    scope.updateUserModal('ev');
    expect(Utils.custom).toHaveBeenCalled();
  });

  it('should load group roles', function() {
    spyOn(Roles, 'query').and.callThrough();
    stateParams.id = 2;
    scope.loadRoles();
    expect(Roles.query).toHaveBeenCalled();
    expect(scope.roles).toBeDefined();
  });

  it('should log a user out', function() {
    spyOn(state, 'go');
    scope.activeUser = true;
    scope.activeGroup = true;
    spyOn(Auth, 'logout').and.callThrough();
    scope.logout();
    expect(scope.activeUser).toBe(null);
    expect(scope.activeGroup).toBe(null);
    expect(state.go).toHaveBeenCalledWith('home.features');
  });

  it('should call scope functions', function() {
    spyOn(scope, 'logout').and.callThrough();
    spyOn(scope, 'updateUserModal').and.callThrough();
    spyOn(state, 'go');
    scope.menuAction('logout');
    expect(scope.logout).toHaveBeenCalled();
    scope.menuAction('Set');
    expect(scope.updateUserModal).toHaveBeenCalled();
    scope.activeUser = user;
    scope.menuAction('Join');
    expect(state.go).toHaveBeenCalledWith('home.group', {
      id: 1
    });
  });

  describe('Side Navigation menu', function() {

    // it('should open the side navigation bar', function() {
    //   spyOn($mdSidenav('lefty'), 'toggle').and.callThrough();
    //   scope.openLeft();
    //   expect($mdSidenav('lefty').toggle).toHaveBeenCalled();
    // });

    // it('should close the side navigation bar', function() {
    //   spyOn(mdSidenav, 'close').and.callThrough();
    //   scope.close();
    //   expect(mdSidenav.close).toHaveBeenCalled();
    // });

  });

});

describe('DashBoardCtrl tests', function() {
  'use strict';
  var scope,
    open,
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
        _id: 1,
        title: 'Test Group 1'
      }],
      roles: [{
        _id: 2,
        groupId: [{
          _id: 1,
          title: 'Test Group'
        }]
      }]
    },
    Token = {
      get: function() {
        return [{
          token: 'asdfgh'
        }, 1];
      }
    },
    mdSidenav = function(dir) {
      if (dir) {
        return {
          toggle: function() {
            open = dir;
          },
          close: function() {
            open = dir;
          }
        };
      } else {
        return false;
      }
    },
    mdOpenMenu = function(ev) {
      if (ev) {
        open = true;
      }
    },
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
      Token: Token,
      $mdSidenav: mdSidenav
    });
    state = $injector.get('$state');
    stateParams = $injector.get('$stateParams');
    Utils = $injector.get('Utils');
    Auth = $injector.get('Auth');

  }));

  it('should initialize the controller', function() {
    scope.activeUser = user;
    stateParams.groupid = 1;
    scope.init();
    expect(scope.updateForm).toBeDefined();
    expect(scope.activeGroup).toBeDefined();
    expect(scope.userRole).toBeDefined();
  });

  it('should set scope attribute for admin dashboard', function() {
    scope.activeUser = user;
    state.current.name = 'dashboard.admin.group';
    scope.init();
    expect(scope.groupName).toBe('Admin Dashboard');
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

  it('should open a menu', function() {
    scope.openMenu(mdOpenMenu, 'ev');
    expect(open).toBeTruthy();
  });

  describe('Side Navigation menu', function() {

    it('should open the side navigation bar', function() {
      scope.openLeft();
      expect(open).toBe('lefty');
    });

    it('should open the side navigation bar', function() {
      scope.close();
      expect(open).toBe('lefty');
    });

  });

});

describe('DashBoardCtrl tests', function() {
  'use strict';
  var scope,
    open,
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
      query: function(params, cb, cbb) {
        return (params.groupid) ?
          cb([{
            message: 'I am groot',
            data: [1, 3, 4]
          }]) : cbb('error');
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
          token: 'token'
        }, 1];
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
    httpBackend,
    controller;

  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('DashBoardCtrl', {
      $scope: scope,
      Roles: Roles,
      Token: Token,
    });
    state = $injector.get('$state');
    stateParams = $injector.get('$stateParams');
    Utils = $injector.get('Utils');
    Auth = $injector.get('Auth');

    httpBackend = $injector.get('$httpBackend');

    httpBackend
      .whenGET('/api/session')
      .respond(200, {
        data: {
          user: {
            _id: 1,
            groupId: []
          },
          token: 'token'
        },
        group: ''
      });

    httpBackend
      .whenGET('views/home.html')
      .respond(200, [{
        res: 'res'
      }]);

  }));

  describe('Initialization of the controler', function() {
    beforeEach(function() {
      scope.$digest();
    });

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
      scope.init();
      state.current.name = 'dashboard.admin.group';
      scope.$digest();
      expect(scope.groupName).toBe('Admin');
    });

    it('should set scope attribute for admin dashboard', function() {
      scope.activeUser = user;
      scope.init();
      state.current.name = 'dashboard.admin.user';
      scope.$digest();
      expect(scope.groupName).toBe('Admin');
    });

    it('should set scope attribute for admin dashboard', function() {
      scope.activeUser = user;
      stateParams.groupid = 1;
      scope.init();
      state.current.name = 'dashboard.admin';
      scope.$digest();
      expect(scope.groupName).toBe('Test Group 1');
    });

    it('should redirect to login if no active user', function() {
      spyOn(state, 'go');
      scope.activeUser = null;
      scope.init();
      expect(state.go).toHaveBeenCalledWith('home.login');
    });
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

  it('should load group data', function() {
    spyOn(Roles, 'query').and.callThrough();
    stateParams.groupid = 2
    scope.loadRoles();
    expect(Roles.query).toHaveBeenCalled();
    expect(scope.roles).toBeDefined();
  });

  it('should return error loading group data', function() {
    spyOn(Roles, 'query').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    scope.loadRoles();
    expect(Utils.showAlert).toHaveBeenCalled();
    expect(Roles.query).toHaveBeenCalled();
    expect(scope.roles).not.toBeDefined();
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
    spyOn(scope, 'openSideNav').and.callThrough();
    spyOn(state, 'go');
    scope.menuAction('logout');
    expect(scope.logout).toHaveBeenCalled();
    scope.menuAction('Set');
    expect(scope.openSideNav).toHaveBeenCalledWith('right');
    scope.activeUser = user;
    scope.menuAction('Join');
    expect(state.go).toHaveBeenCalledWith('dashboard.group', {
      id: 1
    });
  });

  it('should open a menu', function() {
    scope.openMenu(mdOpenMenu, 'ev');
    expect(open).toBeTruthy();
  });

});

describe('LoginCtrl tests', function() {
  'use strict';
  var scope,
    Users = {
      login: function(user, cb) {
        if (user.password && user.username === 'superAdmin') {
          cb(null, {
            data: {
              user: {
                name: 3,
                _id: 1,
                groupId: [],
                roles: [{
                  title: 'superAdmin',
                  _id: 2
                }]
              }
            }
          });
        } else if (user.password && user.username === 'testUser') {
          cb(null, {
            data: {
              user: {
                name: 3,
                _id: 1,
                groupId: [{
                  _id: 1
                }],
                roles: []
              }
            }
          });
        } else if (user.password && user.username === 'newUser') {
          cb(null, {
            data: {
              user: {
                name: 3,
                _id: 1,
                groupId: [],
                roles: []
              }
            }
          });
        } else if (!user.password || !user.username) {
          cb(true, null);
        }
      }
    },
    state,
    Auth,
    controller;

  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('LoginCtrl', {
      $scope: scope,
      Users: Users
    });
    Auth = $injector.get('Auth');
    state = $injector.get('$state');
  }));

  it('should call the login service and fail', function() {
    spyOn(Users, 'login').and.callThrough();
    spyOn(Auth, 'setToken');
    spyOn(state, 'go');
    scope.loginForm.userdata = false;
    scope.loginForm.password = false;

    scope.login();
    expect(Users.login).toHaveBeenCalled();
    expect(Auth.setToken).not.toHaveBeenCalled();
    expect(scope.loginErr).toBe('Invalid Username/Password');
    expect(scope.activeUser).not.toBeDefined();
  });

  it('should call the login service and go to user dasboard', function() {
    spyOn(Users, 'login').and.callThrough();
    spyOn(Auth, 'setToken').and.callThrough();;
    spyOn(state, 'go');
    scope.loginForm.userdata = 'testUser';
    scope.loginForm.password = true;

    scope.login();
    expect(Users.login).toHaveBeenCalled();
    expect(Auth.setToken).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalledWith('dashboard.list', {
      id: 1,
      groupid: 1
    });
    expect(scope.activeGroup).toBeDefined();
    expect(scope.loginErr).toBe('');
  });

  it('should call the login service and go to admin dasboard', function() {
    spyOn(Users, 'login').and.callThrough();
    spyOn(Auth, 'setToken');
    spyOn(state, 'go');
    scope.loginForm.userdata = 'superAdmin';
    scope.loginForm.password = true;

    scope.login();
    expect(Users.login).toHaveBeenCalled();
    expect(Auth.setToken).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalledWith('dashboard.admin.user', {
      id: 1
    });
    expect(scope.loginErr).toBe('');
  });

  it('should call the login service and go to group page', function() {
    spyOn(Users, 'login').and.callThrough();
    spyOn(Auth, 'setToken');
    spyOn(state, 'go');
    scope.loginForm.userdata = 'newUser';
    scope.loginForm.password = true;

    scope.login();
    expect(Users.login).toHaveBeenCalled();
    expect(Auth.setToken).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalledWith('home.group', {
      id: 1
    });
    expect(scope.activeGroup).not.toBeDefined();
    expect(scope.loginErr).toBe('');
  });

});

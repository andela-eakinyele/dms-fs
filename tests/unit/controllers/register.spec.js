describe('SignupCtrl tests', function() {
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
      },
      save: function(user, cb, cbb) {
        cb(user);
        cbb({
          status: 409,
          data: {
            error: 'this is bad'
          }
        });
      }
    },
    state,
    Auth,
    Utils,
    controller;

  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('SignupCtrl', {
      $scope: scope,
      Users: Users
    });
    Auth = $injector.get('Auth');
    Utils = $injector.get('Utils');
    state = $injector.get('$state');
  }));

  it('should init controller', function() {
    scope.init();
    expect(scope.signupErr).toBeDefined();
    expect(scope.signform).toBeDefined();
  });
  it('should call the save function in the Users service', function() {
    spyOn(Users, 'save').and.callThrough();
    spyOn(Users, 'login').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    spyOn(Auth, 'setToken');
    spyOn(state, 'go');
    scope.signform.username = 'newUser';
    scope.signform.password = true;

    scope.createUser();
    expect(Users.save).toHaveBeenCalled();
    expect(Users.login).toHaveBeenCalled();
    expect(Auth.setToken).toHaveBeenCalled();
    expect(Utils.showAlert).toHaveBeenCalled();

    expect(state.go).toHaveBeenCalledWith('dashboard.group', {
      id: 1
    });
    expect(scope.activeUser).toBeDefined();
  });


});

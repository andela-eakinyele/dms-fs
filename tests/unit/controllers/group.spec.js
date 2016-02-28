(function() {
  'use strict';

  describe('GroupCtrl tests', function() {

    var scope,

      sampleUser = {
        ownerId: [{
          name: {
            first: 'a',
            last: 'b'
          }
        }]
      },

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

      Users = {
        login: function(user, cb) {
          if (user.password && user.username === 'superAdmin') {
            return cb(null, {
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
            return cb(null, {
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
            return cb(null, {
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
            return cb(true, null);
          }
        },

        joingroup: function(data, cb) {
          var user = {
            _id: 1,
            groupId: [{
              _id: 3
            }],
            roles: [{
              _id: 2
            }]
          };
          if (data) {
            return cb(null, {
              data: user
            });
          } else {
            return cb('error');
          }
        },

        get: function(params, successCallback, errorCallback) {
          return params.id ? successCallback({
            data: sampleUser
          }) : errorCallback({
            error: 'error'
          });
        },

        update: function(params, data, successCallback, errorCallback) {
          return (params.id && data) ?
            successCallback({
              _id: data,
              groupId: [{
                _id: 1
              }]
            }) : errorCallback(false);
        },
      },

      Groups = {
        save: function(data, successCallback, errorCallback) {
          return data ? successCallback({
            _id: 1
          }) : errorCallback(false);
        },

        delete: function(params, successCallback, errorCallback) {
          if (params.id) {
            return successCallback();
          } else if (!params.id) {
            return errorCallback();
          }
        },

        update: function(params, data, successCallback, errorCallback) {
          return (params.id && data) ?
            successCallback(data) : errorCallback(false);
        },

        get: function(params, successCallback, errorCallback) {
          return params.id ? successCallback({
            users: [{
              roles: [1, 2, 3]
            }]
          }) : errorCallback({
            error: 'error'
          });
        },

        query: function(params, successCallback, errorCallback) {
          if (params) {
            if (successCallback) {
              return successCallback({
                data: [{
                  _id: 1,
                  title: 'Pollock'
                }]
              });
            }
            return ({
              data: [{
                _id: 1,
                title: 'Pollock'
              }]
            });
          } else {
            if (errorCallback) {
              return errorCallback({
                error: 'error'
              });
            }
            return ({
              data: [{
                _id: 1,
                title: 'Pollock'
              }]
            });
          }
        }
      },

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
      controller;

    beforeEach(function() {
      module('prodocs');
    });

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      controller = $controller('GroupCtrl', {
        $scope: scope,
        Users: Users,
        Groups: Groups,
        Roles: Roles
      });
      state = $injector.get('$state');
      stateParams = $injector.get('$stateParams');

    }));

    it('should initialize the controller', function() {
      spyOn(Groups, 'query').and.callThrough();
      scope.init();
      expect(scope.newgroup).toBe(true);
      expect(scope.buttonName).toBeDefined();
      expect(scope.check).toBeDefined();
      expect(scope.signform).toBeDefined();
      expect(scope.pform).toBeDefined();
      expect(scope.groupErr).toBe('');
      expect(Groups.query).toHaveBeenCalled();
      expect(scope.groups).toBeDefined();
    });

    it('should toggle checkboxes', function() {
      scope.init();
      scope.toggle();
      expect(scope.newgroup).toBe(false);
      expect(scope.joingroup).toBe(true);
      expect(scope.check[0]).toBe(false);
      expect(scope.check[1]).toBe(true);
    });

    it('should load group roles', function() {
      spyOn(Roles, 'query').and.callThrough();
      scope.init();
      scope.signform.group = {
        _id: 2
      };
      scope.getRoles();
      expect(Roles.query).toHaveBeenCalled();
      expect(scope.roles).toBeDefined();
    });

    it('should create a group', function() {
      spyOn(Groups, 'save').and.callThrough();
      spyOn(Users, 'get').and.callThrough();
      spyOn(state, 'go');
      stateParams.id = 1;
      scope.pform = {};
      scope.addGroup();
      expect(Groups.save).toHaveBeenCalled();
      expect(Users.get).toHaveBeenCalled();
      expect(scope.groupErr).toBe('Group saved');
      expect(scope.activeGroup).toBeDefined();
      expect(scope.activeUser).toBeDefined();
      expect(state.go).toHaveBeenCalled();
    });


    it('should add a user to a group', function() {
      spyOn(state, 'go');
      spyOn(Users, 'joingroup').and.callThrough();
      stateParams.id = 1;
      scope.init();
      scope.signform.group = {
        _id: 2,
        users: [1]
      };
      scope.signform.role = {
        _id: 2,
        users: [1]
      };
      scope.signform.passphrase = 'Hoot';
      scope.activeUser = {
        _id: 1,
        groupId: [{
          _id: 3
        }],
        roles: [{
          _id: 2
        }]
      };
      scope.joinGroup();
      expect(Users.joingroup).toHaveBeenCalled();
      expect(scope.groupErr).toBe('Successfully added to group');
      expect(scope.activeUser).toBeDefined();
      expect(scope.activeGroup).toBeDefined();
      expect(state.go).toHaveBeenCalled();
    });

  });
})();

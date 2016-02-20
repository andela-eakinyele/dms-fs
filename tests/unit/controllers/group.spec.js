(function() {
  'use strict';

  describe('GroupCtrl tests', function() {

    var scope,
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
        get: function(id, cb, cbb) {
          return id ? cb(true) : cbb(false);
        },
        update: function(id, data, cb, cbb) {
          return (id && data) ? cb({
            _id: data,
            groupId: [{
              _id: 1
            }]
          }) : cbb(false);
        }
      },
      Groups = {
        save: function(data, cb, cbb) {
          return data ? cb({
            _id: data
          }) : cbb(false);
        },
        update: function(params, data, cb, cbb) {
          return (params.id && data) ? cb({
            _id: data
          }) : cbb(false);
        },
        get: function(params, cb, cbb) {
          return params.id ? cb({
            message: 'I am groot',
            data: [1, 3, 4]
          }) : cbb({
            message: 'error'
          });
        },
        query: function() {
          return [{
            message: 'I am groot',
            data: [1, 3, 4]
          }];
        }
      },
      Roles = {
        save: function(data, cb) {
          return data ? cb(data) : cb(false);
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
        query: function(params) {
          if (params.groupid) {
            return [{
              message: 'I am groot',
              data: [1, 3, 4]
            }];
          } else {
            return 'error';
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
      spyOn(Groups, 'update').and.callThrough();
      spyOn(Roles, 'update').and.callThrough();
      spyOn(Users, 'update').and.callThrough();
      spyOn(state, 'go');
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
      expect(scope.groupErr).toBe('Successfully added to group');
      expect(Groups.update).toHaveBeenCalled();
      expect(Roles.update).toHaveBeenCalled();
      expect(Users.update).toHaveBeenCalled();
      expect(scope.activeUser).toBeDefined();
      expect(scope.activeGroup).toBeDefined();
      expect(state.go).toHaveBeenCalled();
    });

  });
})();

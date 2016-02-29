(function() {
  'use strict';

  describe('AdminTableCtrl tests', function() {

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

      sampleDoc = {
        ownerId: [{
          name: {
            first: 'a',
            last: 'b'
          }
        }]
      },

      sampleUser = {
        ownerId: [{
          name: {
            first: 'a',
            last: 'b'
          }
        }]
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

        delete: function(params, successCallback, errorCallback) {
          if (params.id) {
            return successCallback();
          } else if (!params.id) {
            return errorCallback();
          }
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

      Docs = {
        save: function(data, successCallback, errorCallback) {
          return data ?
            successCallback(data) : errorCallback(false);
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
            message: 'I am groot',
            data: [sampleDoc]
          }) : errorCallback({
            error: 'error'
          });
        },

        query: function(params, successCallback, errorCallback) {
          if (params.groupid) {
            return successCallback([sampleDoc]);
          } else {
            return errorCallback(true);
          }
        },

        bulkdelete: function(data, cb) {
          if (data.length > 0) {
            return cb(null, data);
          } else {
            return cb({
              error: 'err'
            });
          }
        },

        bulkview: function(data, cb) {
          if (data.length > 0) {
            return cb(null, data);
          } else {
            return cb({
              error: 'err'
            });
          }
        }
      },

      Users = {
        save: function(data, successCallback, errorCallback) {
          return data ? successCallback(data) : errorCallback(false);
        },

        update: function(params, data, successCallback, errorCallback) {
          return (params.id && data) ?
            successCallback(data) : errorCallback(false);
        },

        delete: function(params, successCallback, errorCallback) {
          if (params.id) {
            return successCallback();
          } else if (!params.id) {
            return errorCallback();
          }
        },

        get: function(params, successCallback, errorCallback) {
          return params.id ? successCallback({
            data: sampleUser
          }) : errorCallback({
            error: 'error'
          });
        },

        query: function(params, successCallback, errorCallback) {
          if (params.page) {
            return successCallback([sampleUser]);
          } else {
            return errorCallback({
              error: 'error'
            });
          }
        }
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
            return successCallback([{
              data: [sampleUser]
            }]);
          } else {
            return errorCallback({
              error: 'error'
            });
          }
        }
      },

      Counts = {
        get: function(params, successCallback, errorCallback) {
          return (params.name) ?
            successCallback({
              count: 3
            }) : errorCallback(true);
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

      state,
      Utils,
      Auth,
      Token,
      stateParams,
      controller;

    beforeEach(function() {
      module('prodocs');
    });

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      controller = $controller('AdminTableCtrl', {
        $scope: scope,
        Docs: Docs,
        Roles: Roles,
        Groups: Groups,
        Users: Users,
        Counts: Counts
      });

      state = $injector.get('$state');
      Utils = $injector.get('Utils');
      Auth = $injector.get('Auth');
      Token = $injector.get('Token');
      stateParams = $injector.get('$stateParams');

      stateParams.query = {
        page: 1,
        limit: 10
      };

      Utils.showConfirm = function(evt, title, action, msg, cb) {
        if (title === 'Delete') {
          return cb();
        }
      };
    }));

    describe('when selecting checkboxes', function() {

      it('should unselect a document', function() {
        var list = [1, 2];
        var item = 1;
        scope.toggle(item, list);
        expect(list.length).toBe(1);
      });

      it('should select a document', function() {
        var list = [2];
        var item = 1;
        scope.toggle(item, list);
        expect(list.length).toBe(2);
      });

      it('should select all items', function() {
        scope.selected = [];
        var list = [{
          '_id': 1
        }, {
          '_id': 2
        }];
        scope.selectAll(list);
        expect(scope.selected.length).toBe(2);
      });

      it('should unselect all items', function() {
        scope.selected = [1, 2];
        var list = [{
          '_id': 1
        }, {
          '_id': 2
        }];
        scope.selectAll(list);
        expect(scope.selected.length).toBe(0);
      });

      it('should check if item is selected', function() {
        var list = [1, 2];
        expect(scope.isSelected(1, list)).toBeTruthy();
      });

      it('should check if all items are selected', function() {
        scope.selected = [1, 2];
        var list = [{
          '_id': 1
        }, {
          '_id': 2
        }];
        expect(scope.all(list)).toBeTruthy();
        scope.selected = false;
        expect(scope.all(list)).toBeFalsy();
      });

    });

    it('should check if a document is editable', function() {
      scope.activeUser = user;
      var doc = {
        ownerId: [{
          _id: 1
        }]
      };
      expect(scope.editDoc(doc)).toBeTruthy();
    });

    it('should call menu actions', function() {
      spyOn(state, 'go');
      scope.menuAction('edit', 1);
      expect(state.go).toHaveBeenCalledWith('dashboard.doc.edit', {
        docId: 1
      });
      spyOn(scope, 'deleteOne');
      scope.menuAction('delete', 1);
      expect(scope.deleteOne).toHaveBeenCalled();
    });

    it('should get date', function() {
      spyOn(Utils, 'parseDate').and.callThrough();
      var date = scope.getDate(Date.now());
      expect(Utils.parseDate).toHaveBeenCalled();
      expect(date.day).toBeDefined();
      expect(date.time).toBeDefined();
    });

    describe('Deleting items from a table', function() {
      beforeEach(function() {
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
      });

      describe('when deleting a document', function() {
        // common spies
        beforeEach(function() {
          spyOn(Docs, 'delete').and.callThrough();
        });

        it('should delete a document', function() {
          scope.listName = 'docs';
          scope.docs = [1, 2];
          scope.deleteOne(1, 0, 'ev');
          expect(Docs.delete).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(scope.docs.length).toBe(1);
        });

        it('should return error deleting a dcoument', function() {
          scope.listName = 'docs';
          scope.docs = [1, 2];
          scope.deleteOne(false, 0);
          expect(Docs.delete).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(scope.docs.length).toBe(2);
        });
      });

      describe('when deleting a role', function() {

        beforeEach(function() {
          spyOn(Roles, 'delete').and.callThrough();
        });

        it('should delete a role', function() {
          scope.listName = 'roles';
          scope.roles = [1, 2];
          scope.deleteOne(1, 0);
          expect(Roles.delete).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(scope.roles.length).toBe(1);
        });

        it('should return error deleting a role', function() {
          scope.listName = 'roles';
          scope.roles = [1, 2];
          scope.deleteOne(false, 0);
          expect(Roles.delete).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.roles.length).toBe(2);
        });
      });

      describe('when deleting a group', function() {

        beforeEach(function() {
          spyOn(Groups, 'delete').and.callThrough();
        });

        it('should delete a group', function() {
          scope.listName = 'groups';
          scope.groups = [1, 2];
          scope.deleteOne(1, 0);
          expect(Groups.delete).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.groups.length).toBe(1);
        });

        it('should return error deleting a group', function() {
          scope.listName = 'groups';
          scope.groups = [1, 2];
          scope.deleteOne(false, 0);
          expect(Groups.delete).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.groups.length).toBe(2);
        });
      });

      describe('when deleting a user', function() {

        beforeEach(function() {
          spyOn(Users, 'delete').and.callThrough();
        });

        it('should delete a user', function() {
          scope.listName = 'appUsers';
          scope.allUsers = [1, 2];
          scope.deleteOne(1, 0);
          expect(Users.delete).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.allUsers.length).toBe(1);
        });

        it('should return error deleting a user', function() {
          scope.listName = 'appUsers';
          scope.allUsers = [1, 2];
          scope.deleteOne(false, 0);
          expect(Users.delete).toHaveBeenCalled();
          expect(Utils.showConfirm).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.allUsers.length).toBe(2);
        });
      });
    });

    // Group Admin dashboard
    // group roles
    describe('when viewing list of roles, ' +
      'documents, users, groups',
      function() {

        beforeEach(function() {
          spyOn(scope, 'init').and.callThrough();
          spyOn(scope, 'getRoles').and.callThrough();
        });

        it('should load the list of roles in a group', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callThrough();
          stateParams.groupid = 1;
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Counts.get).toHaveBeenCalled();
          expect(scope.query).toBeDefined();
          expect(scope.roles).toBeDefined();
          expect(scope.count).toBeDefined();
        });

        it('should throw error loading roles', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callThrough();
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Counts.get).not.toHaveBeenCalled();
          expect(scope.roles).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
          expect(scope.roleErr).toBeDefined();
        });

        it('should load empty roles', function() {
          spyOn(Roles, 'query').and.callFake(function(params, successCallback) {
            return successCallback([]);
          });
          spyOn(Counts, 'get').and.callThrough();
          stateParams.groupid = 1;
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Counts.get).not.toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.roles).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
          expect(scope.roleErr).toBeDefined();
        });

        it('should throw error loading role count', function() {
          stateParams.groupid = 1;
          spyOn(Roles, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callFake(
            function(params, successCallback, errorCallback) {
              return errorCallback(true);
            });
          spyOn(Utils, 'showAlert').and.callThrough();
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Counts.get).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.roles).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

        it('should load pages of role', function() {
          scope.onPaginateRole(2, 1);
          expect(scope.selected.length).toBe(0);
          expect(scope.getRoles).toHaveBeenCalled();
        });
      });

    // Group admin document view
    describe('Group Admin - dcoument', function() {

      beforeEach(function() {
        spyOn(scope, 'init').and.callThrough();
        spyOn(scope, 'getDocs').and.callThrough();
      });

      it('should load the list of documents in a group', function() {
        spyOn(Docs, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callThrough();
        stateParams.groupid = 1;
        scope.docList();
        expect(scope.listName).toBe('docs');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getDocs).toHaveBeenCalled();
        expect(Docs.query).toHaveBeenCalled();
        expect(Counts.get).toHaveBeenCalled();
        expect(scope.docs).toBeDefined();
        expect(scope.count).toBeDefined();
      });

      it('should load empty list of documents in a group', function() {
        spyOn(Docs, 'query').and.callFake(function(params, successCallback) {
          return successCallback([]);
        });
        spyOn(Counts, 'get').and.callThrough();
        stateParams.groupid = 1;
        scope.docList();
        expect(scope.listName).toBe('docs');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getDocs).toHaveBeenCalled();
        expect(Docs.query).toHaveBeenCalled();
        expect(Counts.get).not.toHaveBeenCalled();
        expect(scope.docs).not.toBeDefined();
        expect(scope.docErr).toBeDefined();
        expect(scope.count).not.toBeDefined();
      });

      it('should throw error loading documents', function() {
        spyOn(Docs, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callThrough();
        scope.docList();
        expect(scope.listName).toBe('docs');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getDocs).toHaveBeenCalled();
        expect(Docs.query).toHaveBeenCalled();
        expect(Counts.get).not.toHaveBeenCalled();
        expect(scope.docs).not.toBeDefined();
        expect(scope.count).not.toBeDefined();
        expect(scope.docErr).toBeDefined();
      });

      it('should throw error loading documents count', function() {
        spyOn(Docs, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callFake(
          function(params, successCallback, errorCallback) {
            return errorCallback(true);
          });
        spyOn(Utils, 'showAlert').and.callThrough();
        stateParams.groupid = 1;
        scope.docList();
        expect(scope.listName).toBe('docs');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getDocs).toHaveBeenCalled();
        expect(Counts.get).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(Docs.query).toHaveBeenCalled();
        expect(scope.docs).toBeDefined();
        expect(scope.count).not.toBeDefined();
      });

      it('should load pages of documents', function() {
        scope.onPaginateDoc(2, 1);
        expect(scope.selected.length).toBe(0);
        expect(scope.getDocs).toHaveBeenCalled();
      });
    });

    // Group Users
    describe('Group Admin dashboard - Users in a group', function() {

      beforeEach(function() {
        spyOn(scope, 'getGroupUsers').and.callThrough();
        spyOn(Roles, 'query').and.callThrough();
      });

      it('should load the list of users in a group', function() {
        spyOn(scope, 'init').and.callThrough();
        spyOn(Users, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callThrough();
        stateParams.groupid = 1;
        scope.userList();
        expect(scope.listName).toBe('users');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getGroupUsers).toHaveBeenCalled();
        expect(Users.query).toHaveBeenCalled();
        expect(Counts.get).toHaveBeenCalled();
        expect(Roles.query).toHaveBeenCalled();
        expect(scope.users).toBeDefined();
        expect(scope.count).toBeDefined();
      });

      it('should throw error loading users in a group', function() {
        spyOn(scope, 'init').and.callFake(function() {
          scope.query = {};
        });
        spyOn(Users, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callThrough();
        scope.userList();
        expect(scope.listName).toBe('users');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getGroupUsers).toHaveBeenCalled();
        expect(Users.query).toHaveBeenCalled();
        expect(Counts.get).not.toHaveBeenCalled();
        expect(Roles.query).toHaveBeenCalled();
        expect(scope.users).not.toBeDefined();
        expect(scope.count).not.toBeDefined();
      });

      it('should throw error loading users count', function() {
        stateParams.groupid = 1;
        spyOn(scope, 'init').and.callThrough();
        spyOn(Users, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callFake(
          function(params, successCallback, errorCallback) {
            return errorCallback(true);
          });
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.userList();
        expect(scope.listName).toBe('users');
        expect(scope.init).toHaveBeenCalled();
        expect(scope.getGroupUsers).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(Users.query).toHaveBeenCalled();
        expect(Counts.get).toHaveBeenCalled();
        expect(Roles.query).toHaveBeenCalled();
        expect(scope.users).toBeDefined();
        expect(scope.count).not.toBeDefined();
      });

      it('should load empty list of users in a group', function() {
        spyOn(scope, 'init').and.callThrough();
        spyOn(Users, 'query').and.callFake(
          function(params, successCallback) {
            return successCallback([]);
          });
        spyOn(Counts, 'get').and.callThrough();
        stateParams.groupid = 1;
        scope.userList();
        expect(scope.listName).toBe('users');
        expect(scope.init).toHaveBeenCalled();
        expect(Users.query).toHaveBeenCalled();
        expect(Counts.get).not.toHaveBeenCalled();
        expect(scope.getGroupUsers).toHaveBeenCalled();
        expect(Roles.query).toHaveBeenCalled();
        expect(scope.users).not.toBeDefined();
        expect(scope.count).not.toBeDefined();
      });


      it('should load pages of users', function() {
        scope.onPaginateUser(2, 1);
        expect(scope.selected.length).toBe(0);
        expect(scope.getGroupUsers).toHaveBeenCalled();
      });

    });

    describe('Admin dashboard - group', function() {

      beforeEach(function() {
        spyOn(scope, 'init').and.callThrough();
        spyOn(scope, 'getGroups').and.callThrough();
      });

      it('should load the list of groups in the application', function() {
        spyOn(Groups, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callThrough();
        stateParams.groupid = 1;
        scope.groupList();
        expect(scope.listName).toBe('groups');
        expect(Groups.query).toHaveBeenCalled();
        expect(scope.getGroups).toHaveBeenCalled();
        expect(Counts.get).toHaveBeenCalled();
        expect(scope.init).toHaveBeenCalled();
        expect(scope.groups).toBeDefined();
        expect(scope.count).toBeDefined();
      });

      it('should throw error loading groups in the' +
        ' application',
        function() {
          spyOn(Groups, 'query').and.callFake(function(params,
            successCallback, errorCallback) {
            return errorCallback();
          });
          spyOn(Counts, 'get').and.callThrough();
          scope.groupList();
          expect(scope.listName).toBe('groups');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getGroups).toHaveBeenCalled();
          expect(Groups.query).toHaveBeenCalled();
          expect(Counts.get).not.toHaveBeenCalled();
          expect(scope.groups).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

      it('should throw error loading count of groups in the' +
        ' application',
        function() {
          spyOn(Groups, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callFake(
            function(params, successCallback, errorCallback) {
              return errorCallback(true);
            });
          spyOn(Utils, 'showAlert').and.callThrough();
          stateParams.groupid = 1;
          scope.groupList();
          expect(scope.listName).toBe('groups');
          expect(Groups.query).toHaveBeenCalled();
          expect(scope.getGroups).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Counts.get).toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.groups).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

      it('should load empty list of groups in the' +
        ' application',
        function() {
          spyOn(Groups, 'query').and.callFake(
            function(params, successCallback) {
              return successCallback([]);
            });
          spyOn(Counts, 'get').and.callThrough();
          stateParams.groupid = 1;
          scope.groupList();
          expect(scope.listName).toBe('groups');
          expect(Groups.query).toHaveBeenCalled();
          expect(scope.getGroups).toHaveBeenCalled();
          expect(Counts.get).not.toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.groups).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
        });


      it('should load pages of groups', function() {
        scope.onPaginateGroup(2, 1);
        expect(scope.selected.length).toBe(0);
        expect(scope.getGroups).toHaveBeenCalled();
      });
    });

    describe('when viewing app users', function() {

      beforeEach(function() {
        spyOn(Token, 'get').and.callFake(function() {
          return [JSON.stringify({
            user: {
              _id: 1
            },
            token: 'insidious'
          }), ''];
        });
        spyOn(Auth, 'setToken').and.callThrough();
        stateParams.query = {
          page: 1,
          limit: 10
        };
      });

      beforeEach(function() {
        spyOn(scope, 'getAppUsers').and.callThrough();
      });

      it('should load list of users of the application', function() {
        spyOn(scope, 'init').and.callThrough();
        spyOn(Users, 'query').and.callThrough();
        spyOn(Counts, 'get').and.callThrough();
        stateParams.groupid = 1;
        scope.appUsers();
        expect(scope.listName).toBe('appUsers');
        expect(scope.init).toHaveBeenCalled();
        expect(Users.query).toHaveBeenCalled();
        expect(scope.getAppUsers).toHaveBeenCalled();
        expect(Counts.get).toHaveBeenCalled();
        expect(scope.allUsers).toBeDefined();
        expect(scope.count).toBeDefined();
      });

      it('should throw error loading list of users' +
        ' of the application',
        function() {
          spyOn(scope, 'init').and.callFake(function() {
            scope.query = {};
          });
          spyOn(Users, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callThrough();
          scope.appUsers();
          expect(scope.allUsers).not.toBeDefined();
          expect(scope.listName).toBe('appUsers');
          expect(Users.query).toHaveBeenCalled();
          expect(scope.getAppUsers).toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(Auth.setToken).toHaveBeenCalled();
          expect(Token.get).toHaveBeenCalled();
          expect(Counts.get).not.toHaveBeenCalled();
          expect(scope.count).not.toBeDefined();
        });

      it('should throw err loading count of users' +
        ' of the application',
        function() {
          stateParams.groupid = 1;
          spyOn(scope, 'init').and.callThrough();
          spyOn(Users, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callFake(
            function(params, successCallback, errorCallback) {
              return errorCallback(true);
            });
          spyOn(Utils, 'showAlert').and.callThrough();
          scope.appUsers();
          expect(scope.listName).toBe('appUsers');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getAppUsers).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(Auth.setToken).toHaveBeenCalled();
          expect(Token.get).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Counts.get).toHaveBeenCalled();
          expect(scope.allUsers).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

      it('should load empty list of users' +
        ' of the application',
        function() {

          spyOn(scope, 'init').and.callThrough();
          spyOn(Users, 'query').and.callFake(function(params, successCallback) {
            return successCallback([]);
          });
          spyOn(Counts, 'get').and.callThrough();
          scope.appUsers();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.listName).toBe('appUsers');
          expect(scope.getAppUsers).toHaveBeenCalled();
          expect(Auth.setToken).toHaveBeenCalled();
          expect(Token.get).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(scope.allUsers).not.toBeDefined();
          expect(Counts.get).not.toHaveBeenCalled();
          expect(scope.count).not.toBeDefined();
        });

      it('should load pages of users', function() {
        scope.onPaginateAppUser(2, 1);
        expect(scope.selected.length).toBe(0);
        expect(scope.getAppUsers).toHaveBeenCalled();
      });

    });

    describe('Table Functions', function() {

      it('should delete a selection list', function() {
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Docs, 'bulkdelete').and.callThrough();
        spyOn(state, 'go').and.callThrough();
        scope.count = 6;
        stateParams = {
          id: 1,
          groupid: 2
        };
        scope.selected = [1, 2, 3];
        scope.deleteSelection('evt');
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Docs.bulkdelete).toHaveBeenCalled();
        expect(scope.count).toBe(3);
        expect(state.go).toHaveBeenCalled();
      });

      it('should alert error deleting a selection list', function() {
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        spyOn(Docs, 'bulkdelete').and.callThrough();
        spyOn(state, 'go').and.callThrough();
        scope.count = 6;
        stateParams = {
          id: 1,
          groupid: 2
        };
        scope.selected = [];
        scope.deleteSelection('evt');
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Docs.bulkdelete).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(scope.count).toBe(6);
        expect(state.go).not.toHaveBeenCalled();
      });

      it('should refresh the tables', function() {
        scope.query = {
          page: 1,
          limit: 10
        };
        spyOn(scope, 'getGroupUsers').and.callThrough();
        scope.listName = 'users';

        scope.refreshTable();
        expect(scope.getGroupUsers).toHaveBeenCalled();

        spyOn(scope, 'getDocs').and.callThrough();
        scope.listName = 'docs';
        scope.refreshTable();
        expect(scope.getDocs).toHaveBeenCalled();

        spyOn(scope, 'getRoles').and.callThrough();
        scope.listName = 'roles';
        scope.refreshTable();
        expect(scope.getRoles).toHaveBeenCalled();

        spyOn(scope, 'getAppUsers').and.callThrough();
        scope.listName = 'appUsers';
        scope.refreshTable();
        expect(scope.getAppUsers).toHaveBeenCalled();

        spyOn(scope, 'getGroups').and.callThrough();
        scope.listName = 'groups';
        scope.refreshTable();
        expect(scope.getGroups).toHaveBeenCalled();
      });
    });

  });

})();

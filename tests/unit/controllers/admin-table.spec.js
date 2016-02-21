(function() {
  'use strict';

  describe('AdminTableCtrl tests', function() {

    var scope,
      Roles = {
        save: function(data, cb, cbb) {
          return (data[0].title !== '') ? cb(data) : cbb(false);
        },
        update: function(params, data, cb, cbb) {
          return (params.id && data) ? cb(data) : cbb(false);
        },
        get: function(params, cb, cbb) {
          return params.groupid ? cb({
            message: 'I am groot',
            data: [1, 3, 4]
          }) : cbb({
            message: 'error'
          });
        },
        delete: function(params, cb, cbb) {
          if (params.id) {
            return cb();
          } else if (!params.id) {
            return cbb();
          }
        },
        count: function(cb) {
          return cb(null, 3);
        },
        query: function(params, cb, cbb) {
          if (params.groupid) {
            if (!cb && !cbb) {
              return [{
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
              }];
            } else {
              return cb([{
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
              }]);
            }
          } else {
            if (cbb) {
              return cbb('err');
            }
          }
        }
      },
      Docs = {
        save: function(data, cb, cbb) {
          return data ? cb(data) : cbb(false);
        },
        delete: function(params, cb, cbb) {
          if (params.id) {
            return cb();
          } else if (!params.id) {
            return cbb();
          }
        },
        count: function(cb) {
          return cb(null, 3);
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
          if (params.groupid) {
            return cb([{
              ownerId: [{
                name: {
                  first: 'a',
                  last: 'b'
                }
              }]
            }]);
          } else {
            return cbb(true);
          }
        }
      },
      Users = {
        save: function(data, cb, cbb) {
          return data ? cb(data) : cbb(false);
        },
        update: function(params, data, cb, cbb) {
          return (params.id && data) ? cb(data) : cbb(false);
        },
        count: function(cb) {
          return cb(null, 3);
        },
        delete: function(params, cb, cbb) {
          if (params.id) {
            return cb();
          } else if (!params.id) {
            return cbb();
          }
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
          if (params.page) {
            return cb([{
              ownerId: [{
                name: {
                  first: 'a',
                  last: 'b'
                }
              }]
            }]);
          } else {
            return cbb('error');
          }
        }
      },
      Groups = {
        save: function(data, cb, cbb) {
          return data ? cb(data) : cbb(false);
        },
        delete: function(params, cb, cbb) {
          if (params.id) {
            return cb();
          } else if (!params.id) {
            return cbb();
          }
        },
        count: function(cb) {
          return cb(null, 3);
        },
        update: function(params, data, cb, cbb) {
          return (params.id && data) ? cb(data) : cbb(false);
        },
        get: function(params, cb, cbb) {
          return params.id ? cb({
            message: 'I am groot',
            users: [{
              roles: [1, 2, 3]
            }]
          }) : cbb({
            message: 'error'
          });
        },
        query: function(params, cb, cbb) {
          if (params) {
            return cb([{
              message: 'I am groot',
              data: [1, 3, 4]
            }]);
          } else {
            return cbb('error');
          }
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
        Users: Users
      });
      state = $injector.get('$state');
      Utils = $injector.get('Utils');
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

    describe('when deleting a document', function() {

      it('should delete a document', function() {
        scope.listName = 'docs';
        scope.docs = [1, 2];
        spyOn(Docs, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(1, 0, 'ev');
        expect(Docs.delete).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(scope.docs.length).toBe(1);
      });

      it('should return error deleting a dcoument', function() {
        scope.listName = 'docs';
        scope.docs = [1, 2];
        spyOn(Docs, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(false, 0);
        expect(Docs.delete).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(scope.docs.length).toBe(2);
      });
    });

    describe('when deleting a role', function() {

      it('should delete a role', function() {
        scope.listName = 'roles';
        scope.roles = [1, 2];
        spyOn(Roles, 'delete').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        scope.deleteOne(1, 0);
        expect(Roles.delete).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(scope.roles.length).toBe(1);
      });

      it('should return error deleting a role', function() {
        scope.listName = 'roles';
        scope.roles = [1, 2];
        spyOn(Roles, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(false, 0);
        expect(Roles.delete).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(scope.roles.length).toBe(2);
      });
    });

    describe('when deleting a group', function() {

      it('should delete a group', function() {
        scope.listName = 'groups';
        scope.groups = [1, 2];
        spyOn(Groups, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(1, 0);
        expect(Groups.delete).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(scope.groups.length).toBe(1);
      });

      it('should return error deleting a group', function() {
        scope.listName = 'groups';
        scope.groups = [1, 2];
        spyOn(Groups, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(false, 0);
        expect(Groups.delete).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(scope.groups.length).toBe(2);
      });
    });

    describe('when deleting a user', function() {

      it('should delete a user', function() {
        scope.listName = 'appUsers';
        scope.allUsers = [1, 2];
        spyOn(Users, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(1, 0);
        expect(Users.delete).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(scope.allUsers.length).toBe(1);
      });

      it('should return error deleting a user', function() {
        scope.listName = 'appUsers';
        scope.allUsers = [1, 2];
        spyOn(Users, 'delete').and.callThrough();
        spyOn(Utils, 'showConfirm').and.callThrough();

        spyOn(Utils, 'showAlert').and.callThrough();
        scope.deleteOne(false, 0);
        expect(Users.delete).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(scope.allUsers.length).toBe(2);
      });
    });


    describe('when viewing list of roles, ' +
      'documents, users, groups',
      function() {

        it('should load the list of roles in a group', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(Roles, 'count').and.callThrough();
          spyOn(scope, 'getRoles').and.callThrough();
          spyOn(scope, 'init').and.callThrough();
          stateParams.groupid = 1;
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(Roles.query).toHaveBeenCalled();
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.count).toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.query).toBeDefined();
          expect(scope.roles).toBeDefined();
          expect(scope.count).toBeDefined();
        });

        it('should throw error loading roles', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(scope, 'getRoles').and.callThrough();
          spyOn(scope, 'init').and.callThrough();
          spyOn(Roles, 'count').and.callThrough();
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Roles.count).not.toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.roles).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
          expect(scope.roleErr).toBeDefined();
        });

        it('should load empty roles', function() {
          spyOn(Roles, 'query').and.callFake(function(params, cb) {
            return cb([]);
          });
          spyOn(scope, 'getRoles').and.callThrough();
          spyOn(scope, 'init').and.callThrough();
          spyOn(Roles, 'count').and.callThrough();
          stateParams.groupid = 1;
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Roles.count).not.toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.roles).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
          expect(scope.roleErr).toBeDefined();
        });

        it('should throw error loading role count', function() {
          stateParams.groupid = 1;
          spyOn(scope, 'init').and.callThrough();
          spyOn(scope, 'getRoles').and.callThrough();
          spyOn(Roles, 'query').and.callThrough();
          spyOn(Roles, 'count').and.callFake(function(cb) {
            return cb(true, null);
          });
          spyOn(Utils, 'showAlert').and.callThrough();
          scope.roleList();
          expect(scope.listName).toBe('roles');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getRoles).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(Roles.count).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.roles).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

        it('should load pages of role', function() {
          spyOn(scope, 'getRoles').and.callThrough();
          scope.onPaginateRole(2, 1);
          expect(scope.selected.length).toBe(0);
          expect(scope.getRoles).toHaveBeenCalled();
        });

        it('should load the list of documents in a group', function() {
          spyOn(scope, 'init').and.callThrough();
          spyOn(Docs, 'query').and.callThrough();
          spyOn(scope, 'getDocs').and.callThrough();
          spyOn(Docs, 'count').and.callThrough();
          stateParams.groupid = 1;
          scope.docList();
          expect(scope.listName).toBe('docs');
          expect(scope.init).toHaveBeenCalled();
          expect(Docs.count).toHaveBeenCalled();
          expect(scope.getDocs).toHaveBeenCalled();
          expect(Docs.query).toHaveBeenCalled();
          expect(scope.docs).toBeDefined();
          expect(scope.count).toBeDefined();
        });

        it('should load empty list of documents in a group', function() {
          spyOn(scope, 'init').and.callThrough();
          spyOn(scope, 'getDocs').and.callThrough();
          spyOn(Docs, 'query').and.callFake(function(params, cb) {
            return cb([]);
          });
          spyOn(Docs, 'count').and.callThrough();
          stateParams.groupid = 1;
          scope.docList();
          expect(scope.listName).toBe('docs');
          expect(scope.init).toHaveBeenCalled();
          expect(Docs.count).not.toHaveBeenCalled();
          expect(scope.getDocs).toHaveBeenCalled();
          expect(Docs.query).toHaveBeenCalled();
          expect(scope.docs).not.toBeDefined();
          expect(scope.docErr).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

        it('should throw error loading documents', function() {
          spyOn(scope, 'init').and.callThrough();
          spyOn(Docs, 'query').and.callThrough();
          spyOn(Docs, 'count').and.callThrough();
          spyOn(scope, 'getDocs').and.callThrough();
          scope.docList();
          expect(scope.listName).toBe('docs');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getDocs).toHaveBeenCalled();
          expect(Docs.count).not.toHaveBeenCalled();
          expect(Docs.query).toHaveBeenCalled();
          expect(scope.docs).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
          expect(scope.docErr).toBeDefined();
        });

        it('should throw error loading documents count', function() {
          spyOn(scope, 'init').and.callThrough();
          spyOn(Docs, 'query').and.callThrough();
          spyOn(Docs, 'count').and.callFake(function(cb) {
            return cb(true, null);
          });
          spyOn(Utils, 'showAlert').and.callThrough();
          stateParams.groupid = 1;
          spyOn(scope, 'getDocs').and.callThrough();
          scope.docList();
          expect(scope.listName).toBe('docs');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getDocs).toHaveBeenCalled();
          expect(Docs.count).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Docs.query).toHaveBeenCalled();
          expect(scope.docs).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

        it('should load pages of documents', function() {
          spyOn(scope, 'getDocs').and.callThrough();
          scope.onPaginateDoc(2, 1);
          expect(scope.selected.length).toBe(0);
          expect(scope.getDocs).toHaveBeenCalled();
        });

        it('should load the list of users in a group', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(scope, 'init').and.callThrough();
          spyOn(Users, 'query').and.callThrough();
          spyOn(scope, 'getGroupUsers').and.callThrough();
          spyOn(Users, 'count').and.callThrough();
          stateParams.groupid = 1;
          scope.userList();
          expect(scope.listName).toBe('users');
          expect(scope.init).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(Users.count).toHaveBeenCalled();
          expect(scope.getGroupUsers).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(scope.users).toBeDefined();
          expect(scope.count).toBeDefined();
        });

        it('should throw error loading users in a group', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(scope, 'init').and.callFake(function() {
            scope.query = {};
          });
          spyOn(Users, 'query').and.callThrough();
          spyOn(Users, 'count').and.callThrough();
          spyOn(scope, 'getGroupUsers').and.callThrough();
          scope.userList();
          expect(scope.listName).toBe('users');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getGroupUsers).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(Users.count).not.toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(scope.users).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

        it('should throw error loading users count', function() {
          stateParams.groupid = 1;
          spyOn(scope, 'init').and.callThrough();
          spyOn(Roles, 'query').and.callThrough();
          spyOn(Users, 'query').and.callThrough();
          spyOn(scope, 'getGroupUsers').and.callThrough();
          spyOn(Users, 'count').and.callFake(function(cb) {
            return cb(true, null);
          });
          spyOn(Utils, 'showAlert').and.callThrough();

          scope.userList();
          expect(scope.listName).toBe('users');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getGroupUsers).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(Users.count).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(scope.users).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

        it('should load empty list of users in a group', function() {
          spyOn(Roles, 'query').and.callThrough();
          spyOn(scope, 'init').and.callThrough();
          spyOn(Users, 'query').and.callFake(function(params, cb) {
            return cb([]);
          });
          spyOn(scope, 'getGroupUsers').and.callThrough();
          spyOn(Users, 'count').and.callThrough();
          stateParams.groupid = 1;
          scope.userList();
          expect(scope.listName).toBe('users');
          expect(scope.init).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(Users.count).not.toHaveBeenCalled();
          expect(scope.getGroupUsers).toHaveBeenCalled();
          expect(Roles.query).toHaveBeenCalled();
          expect(scope.users).not.toBeDefined();
          expect(scope.count).not.toBeDefined();
        });


        it('should load pages of users', function() {
          spyOn(scope, 'getGroupUsers').and.callThrough();
          scope.onPaginateUser(2, 1);
          expect(scope.selected.length).toBe(0);
          expect(scope.getGroupUsers).toHaveBeenCalled();
        });

        it('should load the list of groups in the application', function() {
          spyOn(Groups, 'query').and.callThrough();
          spyOn(scope, 'init').and.callThrough();
          spyOn(Groups, 'count').and.callThrough();
          spyOn(scope, 'getGroups').and.callThrough();
          stateParams.groupid = 1;
          scope.groupList();
          expect(scope.listName).toBe('groups');
          expect(Groups.query).toHaveBeenCalled();
          expect(scope.getGroups).toHaveBeenCalled();
          expect(Groups.count).toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.groups).toBeDefined();
          expect(scope.count).toBeDefined();
        });

        it('should throw error loading groups in the' +
          ' application',
          function() {
            spyOn(scope, 'init').and.callThrough();
            spyOn(scope, 'getGroups').and.callThrough();
            spyOn(Groups, 'query').and.callFake(function(params, cb, cbb) {
              return cbb();
            });
            spyOn(Groups, 'count').and.callThrough();
            scope.groupList();
            expect(scope.listName).toBe('groups');
            expect(scope.init).toHaveBeenCalled();
            expect(scope.getGroups).toHaveBeenCalled();
            expect(Groups.query).toHaveBeenCalled();
            expect(Groups.count).not.toHaveBeenCalled();
            expect(scope.groups).not.toBeDefined();
            expect(scope.count).not.toBeDefined();
          });

        it('should throw error loading count of groups in the' +
          ' application',
          function() {
            spyOn(scope, 'init').and.callThrough();
            spyOn(scope, 'getGroups').and.callThrough();
            spyOn(Groups, 'query').and.callThrough();
            spyOn(Groups, 'count').and.callFake(function(cb) {
              return cb(true, null);
            });
            spyOn(Utils, 'showAlert').and.callThrough();
            stateParams.groupid = 1;
            scope.groupList();
            expect(scope.listName).toBe('groups');
            expect(Groups.query).toHaveBeenCalled();
            expect(scope.getGroups).toHaveBeenCalled();
            expect(Utils.showAlert).toHaveBeenCalled();
            expect(Groups.count).toHaveBeenCalled();
            expect(scope.init).toHaveBeenCalled();
            expect(scope.groups).toBeDefined();
            expect(scope.count).not.toBeDefined();
          });

        it('should load empty list of groups in the' +
          ' application',
          function() {
            spyOn(scope, 'init').and.callThrough();
            spyOn(scope, 'getGroups').and.callThrough();
            spyOn(Groups, 'count').and.callThrough();
            spyOn(Groups, 'query').and.callFake(function(params, cb) {
              return cb([]);
            });
            stateParams.groupid = 1;
            scope.groupList();
            expect(scope.listName).toBe('groups');
            expect(Groups.query).toHaveBeenCalled();
            expect(scope.getGroups).toHaveBeenCalled();
            expect(Groups.count).not.toHaveBeenCalled();
            expect(scope.init).toHaveBeenCalled();
            expect(scope.groups).not.toBeDefined();
            expect(scope.count).not.toBeDefined();
          });


        it('should load pages of groups', function() {
          spyOn(scope, 'getGroups').and.callThrough();
          scope.onPaginateGroup(2, 1);
          expect(scope.selected.length).toBe(0);
          expect(scope.getGroups).toHaveBeenCalled();
        });
      });

    describe('when viewing app users', function() {

      beforeEach(function() {
        stateParams.query = {
          page: 1,
          limit: 10
        };
      });

      it('should load list of users of the application', function() {
        spyOn(scope, 'init').and.callThrough();
        spyOn(scope, 'getAppUsers').and.callThrough();
        spyOn(Users, 'query').and.callThrough();
        spyOn(Users, 'count').and.callThrough();
        stateParams.groupid = 1;
        scope.appUsers();
        expect(scope.listName).toBe('appUsers');
        expect(scope.init).toHaveBeenCalled();
        expect(Users.query).toHaveBeenCalled();
        expect(scope.getAppUsers).toHaveBeenCalled();
        expect(Users.count).toHaveBeenCalled();
        expect(scope.allUsers).toBeDefined();
        expect(scope.count).toBeDefined();
      });

      it('should throw err loading list of users' +
        ' of the application',
        function() {
          spyOn(scope, 'init').and.callFake(function() {
            scope.query = {};
          });
          spyOn(scope, 'getAppUsers').and.callThrough();
          spyOn(Users, 'query').and.callThrough();
          spyOn(Users, 'count').and.callThrough();
          scope.appUsers();
          expect(scope.allUsers).not.toBeDefined();
          expect(scope.listName).toBe('appUsers');
          expect(Users.query).toHaveBeenCalled();
          expect(scope.getAppUsers).toHaveBeenCalled();
          expect(scope.init).toHaveBeenCalled();
          expect(Users.count).not.toHaveBeenCalled();
          expect(scope.count).not.toBeDefined();
        });

      it('should throw err loading count of users' +
        ' of the application',
        function() {
          stateParams.groupid = 1;
          spyOn(scope, 'init').and.callThrough();
          spyOn(scope, 'getAppUsers').and.callThrough();
          spyOn(Users, 'query').and.callThrough();
          spyOn(Users, 'count').and.callFake(function(cb) {
            return cb(true, null);
          });
          spyOn(Utils, 'showAlert').and.callThrough();
          scope.appUsers();
          expect(scope.listName).toBe('appUsers');
          expect(scope.init).toHaveBeenCalled();
          expect(scope.getAppUsers).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(scope.allUsers).toBeDefined();
          expect(scope.count).not.toBeDefined();
        });

      it('should load empty list of users' +
        ' of the application',
        function() {
          spyOn(scope, 'init').and.callThrough();
          spyOn(scope, 'getAppUsers').and.callThrough();
          spyOn(Users, 'query').and.callFake(function(params, cb) {
            return cb([]);
          });
          spyOn(Users, 'count').and.callThrough();
          scope.appUsers();
          expect(scope.init).toHaveBeenCalled();
          expect(scope.listName).toBe('appUsers');
          expect(scope.getAppUsers).toHaveBeenCalled();
          expect(Users.query).toHaveBeenCalled();
          expect(scope.allUsers).not.toBeDefined();
          expect(Users.count).not.toHaveBeenCalled();
          expect(scope.count).not.toBeDefined();
        });

      it('should load pages of users', function() {
        spyOn(scope, 'getAppUsers').and.callThrough();
        scope.onPaginateAppUser(2, 1);
        expect(scope.selected.length).toBe(0);
        expect(scope.getAppUsers).toHaveBeenCalled();
      });

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

})();

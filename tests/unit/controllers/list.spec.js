describe('AdminListCtrl tests', function() {
  'use strict';
  var scope,
    Roles = {
      save: function(data, cb, cbb) {
        (data[0].title !== '') ? cb(data): cbb(false);
      },
      update: function(params, data, cb, cbb) {
        (params.id && data) ? cb(data): cbb(false);
      },
      get: function(params, cb, cbb) {
        params.groupid ? cb({
          message: 'I am groot',
          data: [1, 3, 4]
        }) : cbb({
          message: 'error'
        });
      },
      delete: function(params, cb, cbb) {
        if (params.id) {
          cb();
        } else if (!params.id) {
          cbb();
        }
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
            cb([{
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
            cbb('error');
          }
        } else {
          return 'error';
        }
      }
    },
    Docs = {
      save: function(data, cb, cbb) {
        data ? cb(data) : cbb(false);
      },
      delete: function(params, cb, cbb) {
        if (params.id) {
          cb();
        } else if (!params.id) {
          cbb();
        }
      },
      update: function(params, data, cb, cbb) {
        (params.id && data) ? cb(data): cbb(false);
      },
      get: function(params, cb, cbb) {
        params.id ? cb({
          message: 'I am groot',
          data: [1, 3, 4]
        }) : cbb({
          message: 'error'
        });
      },
      query: function(cb, cbb) {
        cb([{
          ownerId: [{
            name: {
              first: 'a',
              last: 'b'
            }
          }]
        }]);
        cbb('error');
      }
    },
    Users = {
      save: function(data, cb, cbb) {
        data ? cb(data) : cbb(false);
      },
      update: function(params, data, cb, cbb) {
        (params.id && data) ? cb(data): cbb(false);
      },
      delete: function(params, cb, cbb) {
        if (params.id) {
          cb();
        } else if (!params.id) {
          cbb();
        }
      },
      get: function(params, cb, cbb) {
        params.id ? cb({
          message: 'I am groot',
          data: [1, 3, 4]
        }) : cbb({
          message: 'error'
        });
      },
      query: function(cb, cbb) {
        cb([{
          ownerId: [{
            name: {
              first: 'a',
              last: 'b'
            }
          }]
        }]);
        cbb('error');
      }
    },
    Groups = {
      save: function(data, cb, cbb) {
        data ? cb(data) : cbb(false);
      },
      delete: function(params, cb, cbb) {
        if (params.id) {
          cb();
        } else if (!params.id) {
          cbb();
        }
      },
      update: function(params, data, cb, cbb) {
        (params.id && data) ? cb(data): cbb(false);
      },
      get: function(params, cb, cbb) {
        params.id ? cb({
          message: 'I am groot',
          users: [{
            roles: [1, 2, 3]
          }]
        }) : cbb({
          message: 'error'
        });
      },
      query: function(cb, cbb) {
        cb([{
          message: 'I am groot',
          data: [1, 3, 4]
        }]);
        cbb('err');
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
    controller = $controller('AdminListCtrl', {
      $scope: scope,
      Docs: Docs,
      Roles: Roles,
      Groups: Groups,
      Users: Users
    });
    state = $injector.get('$state');
    Utils = $injector.get('Utils');
    stateParams = $injector.get('$stateParams');
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
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(1, 0);
      expect(Docs.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.docs.length).toBe(1);
    });

    it('should return error deleting a dcoument', function() {
      scope.listName = 'docs';
      scope.docs = [1, 2];
      spyOn(Docs, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(false, 0);
      expect(Docs.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.docs.length).toBe(2);
    });
  });

  describe('when deleting a role', function() {

    it('should delete a role', function() {
      scope.listName = 'roles';
      scope.roles = [1, 2];
      spyOn(Roles, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(1, 0);
      expect(Roles.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.roles.length).toBe(1);
    });

    it('should return error deleting a role', function() {
      scope.listName = 'roles';
      scope.roles = [1, 2];
      spyOn(Roles, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(false, 0);
      expect(Roles.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.roles.length).toBe(2);
    });
  });

  describe('when deleting a group', function() {

    it('should delete a group', function() {
      scope.listName = 'groups';
      scope.groups = [1, 2];
      spyOn(Groups, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(1, 0);
      expect(Groups.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.groups.length).toBe(1);
    });

    it('should return error deleting a group', function() {
      scope.listName = 'groups';
      scope.groups = [1, 2];
      spyOn(Groups, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(false, 0);
      expect(Groups.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.groups.length).toBe(2);
    });
  });

  describe('when deleting a user', function() {

    it('should delete a user', function() {
      scope.listName = 'adminUsers';
      scope.allUsers = [1, 2];
      spyOn(Users, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(1, 0);
      expect(Users.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.allUsers.length).toBe(1);
    });

    it('should return error deleting a user', function() {
      scope.listName = 'adminUsers';
      scope.allUsers = [1, 2];
      spyOn(Users, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.deleteOne(false, 0);
      expect(Users.delete).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(scope.allUsers.length).toBe(2);
    });
  });


  describe('when viewing list of roles, dcouments, users, groups', function() {

    it('should load the list of roles in a group', function() {
      spyOn(Roles, 'query').and.callThrough();
      stateParams.groupid = 1;
      scope.roleList();
      expect(scope.listName).toBe('roles');
      expect(Roles.query).toHaveBeenCalled();
      expect(scope.roles).toBeDefined();
    });

    it('should load the list of documents in a group', function() {
      spyOn(Docs, 'query').and.callThrough();
      scope.docList();
      expect(scope.listName).toBe('docs');
      expect(Docs.query).toHaveBeenCalled();
      expect(scope.docs).toBeDefined();
    });

    it('should load the list of users in a group', function() {
      spyOn(Roles, 'query').and.callThrough();
      spyOn(Groups, 'get').and.callThrough();
      stateParams.groupid = 1;
      scope.userList();
      expect(scope.listName).toBe('users');
      expect(Roles.query).toHaveBeenCalled();
      expect(Groups.get).toHaveBeenCalled();
      expect(scope.users).toBeDefined();

    });

    it('should load the list of groups in the application', function() {
      spyOn(Groups, 'query').and.callThrough();
      stateParams.groupid = 1;
      scope.groupList();
      expect(scope.listName).toBe('groups');
      expect(Groups.query).toHaveBeenCalled();
      expect(scope.groups).toBeDefined();
    });
  });

  describe('when viewing app users', function() {

    it('should behave...', function() {
      spyOn(Users, 'query').and.callThrough();
      scope.appUsers();
      expect(scope.allUsers).toBeDefined();
      expect(scope.listName).toBe('adminUsers');
      expect(Users.query).toHaveBeenCalled();
    });

  });

  it('should refresh the tables', function() {
    spyOn(scope, 'userList').and.callThrough();
    scope.listName = 'users';
    scope.refreshTable();
    expect(scope.userList).toHaveBeenCalled();

    spyOn(scope, 'docList').and.callThrough();
    scope.listName = 'docs';
    scope.refreshTable();
    expect(scope.docList).toHaveBeenCalled();

    spyOn(scope, 'roleList').and.callThrough();
    scope.listName = 'roles';
    scope.refreshTable();
    expect(scope.roleList).toHaveBeenCalled();

    spyOn(scope, 'appUsers').and.callThrough();
    scope.listName = 'adminUsers';
    scope.refreshTable();
    expect(scope.appUsers).toHaveBeenCalled();
  });

});

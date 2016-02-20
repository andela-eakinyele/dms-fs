describe('TableCtrl tests', function() {
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
      getUserDocs: function(id, cb) {
        id ? cb(null, 'success') : cb('error', null);
      },
      delete: function(id, cb, cbb) {
        id ? cb('success') : cbb('error');
      },
      getRoleDocs: function(id, cb) {
        id ? cb(null, 'success') : cb('error', null);
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
        if (cb) {
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
      }
    },
    Groups = {
      save: function(data, cb, cbb) {
        data ? cb(data) : cbb(false);
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
        if (cb) {
          cb([{
            message: 'I am groot',
            data: [1, 3, 4]
          }]);
        } else {
          return [{
            message: 'I am groot',
            data: [1, 3, 4]
          }];
        }
      }
    },
    mdOpenMenu = function(ev) {
      if (ev) {
        open = true;
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
    stateParams,
    Utils,
    controller;
  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');

    controller = $controller('TableCtrl', {
      $scope: scope,
      Docs: Docs
    });
    state = $injector.get('$state');
    Utils = $injector.get('Utils');
    stateParams = $injector.get('$stateParams');

    Utils.showConfirm = function(evt, title, action, msg, cb) {
      if (title === 'Delete') {
        return cb();
      }
    };
  }));



  it('should initialize the controller', function() {
    spyOn(scope, 'getDocs');
    scope.init();
    expect(scope.selectedDocs).toBeDefined();
    expect(scope.getDocs).toHaveBeenCalled();
  });

  it('should get documents based on state and valid stateParams - mydocs', function() {
    stateParams.id = 1;
    stateParams.groupid = 2;
    state.current.name = 'dashboard.list.mydocs';
    spyOn(Docs, 'getUserDocs').and.callThrough();
    scope.getDocs();
    expect(Docs.getUserDocs).toHaveBeenCalled();
    expect(scope.docs).toBeDefined();
  });

  it('should get documents based on state and invalid stateParams - mydocs', function() {
    stateParams.groupid = 2;
    state.current.name = 'dashboard.list.mydocs';
    spyOn(Docs, 'getUserDocs').and.callThrough();
    scope.getDocs();
    expect(Docs.getUserDocs).toHaveBeenCalled();
    expect(scope.docs).not.toBeDefined();
  });

  it('should get documents based on state and valid stateParams - shared', function() {
    stateParams.roleid = 1;
    stateParams.groupid = 2;
    state.current.name = 'dashboard.list.shared';
    spyOn(Docs, 'getRoleDocs').and.callThrough();
    scope.getDocs();
    expect(Docs.getRoleDocs).toHaveBeenCalled();
    expect(scope.docs).toBeDefined();
  });

  it('should get documents based on state and invalid stateParams - shared', function() {
    stateParams.groupid = 2;
    state.current.name = 'dashboard.list.shared';
    spyOn(Docs, 'getRoleDocs').and.callThrough();
    scope.getDocs();
    expect(Docs.getRoleDocs).toHaveBeenCalled();
    expect(scope.docs).not.toBeDefined();
  });

  it('should get documents based on state - list', function() {
    stateParams.id = 1;
    stateParams.groupid = 2;
    state.current.name = 'dashboard.list';
    spyOn(Docs, 'query').and.callThrough();
    scope.getDocs();
    expect(Docs.query).toHaveBeenCalled();
    expect(scope.docs).not.toBeDefined();
  });

  it('should return access to doc', function() {
    var doc = {
      ownerId: [{
        _id: 1
      }],
      roles: [{
        _id: 2
      }, {
        _id: 3
      }]
    };
    scope.activeUser = user;
    expect(scope.accessDoc(doc)).toBeTruthy();
  });

  it('should return no acces', function() {
    var doc = {
      ownerId: [{
        _id: 2
      }],
      roles: [{
        _id: 3
      }, {
        _id: 4
      }]
    };
    scope.activeUser = user;
    expect(scope.accessDoc(doc)).toBeFalsy();
  });

  it('should be return edit access', function() {
    var doc = {
      ownerId: [{
        _id: 1
      }],
      roles: [{
        _id: 2
      }, {
        _id: 3
      }]
    };
    scope.activeUser = user;
    expect(scope.editDoc(doc)).toBeTruthy();
  });

  it('should return parse time', function() {
    spyOn(Utils, 'parseDate').and.callThrough();
    var date = scope.getDate(Date.now());
    expect(date.day).toBeDefined();
    expect(date.time).toBeDefined();
  });

  it('should open a menu', function() {
    scope.openMenu(mdOpenMenu, 'ev');
    expect(open).toBeTruthy();
  });

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

  it('should call scope functions', function() {
    spyOn(state, 'go');
    scope.menuAction('edit', 1);
    expect(state.go).toHaveBeenCalledWith('dashboard.doc.edit', {
      docId: 1
    });
    spyOn(Utils, 'showConfirm').and.callThrough();
    spyOn(Docs, 'delete').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    scope.menuAction('delete', 1);
    expect(Docs.delete).toHaveBeenCalled();
    expect(Utils.showAlert).toHaveBeenCalled();
    expect(Utils.showConfirm).toHaveBeenCalled();
    expect(state.go).toHaveBeenCalled();
  });

  it('should refresh the table', function() {
    spyOn(scope, 'getDocs');
    scope.refreshTable()
    expect(scope.getDocs).toHaveBeenCalled();
    expect(scope.selectedDocs.length).toBe(0);
  });

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
      scope.selectedDocs = [];
      var list = [{
        '_id': 1
      }, {
        '_id': 2
      }];
      scope.selectAll(list);
      expect(scope.selectedDocs.length).toBe(2);
    });

    it('should unselect all items', function() {
      scope.selectedDocs = [1, 2];
      var list = [{
        '_id': 1
      }, {
        '_id': 2
      }];
      scope.selectAll(list);
      expect(scope.selectedDocs.length).toBe(0);
    });

    it('should check if item is selected', function() {
      var list = [1, 2];
      expect(scope.isSelected(1, list)).toBeTruthy();
    });

    it('should check if all items are selected', function() {
      scope.selectedDocs = [1, 2];
      var list = [{
        '_id': 1
      }, {
        '_id': 2
      }];
      expect(scope.all(list)).toBeTruthy();
      scope.selectedDocs = false;
      expect(scope.all(list)).toBeFalsy();
    });

  });

});

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
      bulkDelete: function(arr, cb) {
        (arr instanceof Array) ?
        cb(null): cb('error');
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
        cb([{
          message: 'I am groot',
          data: [1, 3, 4]
        }]);
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
      Groups: Groups
    });
    state = $injector.get('$state');
    stateParams = $injector.get('$stateParams');
  }));

  it('should load the list of users in a group', function() {
    spyOn(Roles, 'query').and.callThrough();
    spyOn(Groups, 'get').and.callThrough();
    stateParams.groupid = 1;
    scope.userList();
    expect(Roles.query).toHaveBeenCalled();
    expect(scope.gridOptions1).toBeDefined();
    expect(Groups.get).toHaveBeenCalled();
    expect(scope.gridOptions1.data).toBeDefined();
  });

  it('should load the list of roles in a group', function() {
    spyOn(Roles, 'query').and.callThrough();
    stateParams.groupid = 1;
    scope.roleList();
    expect(Roles.query).toHaveBeenCalled();
    expect(scope.gridOptions2).toBeDefined();
    expect(scope.roles).toBeDefined();
    expect(scope.gridOptions2.data).toBeDefined();
  });

  it('should load the list of documents in a group', function() {
    spyOn(Docs, 'query').and.callThrough();
    scope.docList();
    expect(Docs.query).toHaveBeenCalled();
    expect(scope.gridOptions3).toBeDefined();
    expect(scope.docs).toBeDefined();
    expect(scope.gridOptions3.data).toBeDefined();
  });

});

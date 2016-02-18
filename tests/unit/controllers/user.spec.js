describe('UserCtrl tests', function() {
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
      username: 'Pollock',
      _id: 1,
      groupId: [{
        _id: 3
      }],
      roles: [{
        _id: 2,
        title: '',
        groupId: [1]
      }]
    },
    state,
    stateParams,
    mdDialog,
    Utils,
    controller;
  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('UserCtrl', {
      $scope: scope,
      Docs: Docs,
      Roles: Roles,
      Groups: Groups,
      Users: Users
    });
    state = $injector.get('$state');
    stateParams = $injector.get('$stateParams');
    mdDialog = $injector.get('$mdDialog');
    Utils = $injector.get('Utils');
  }));

  it('should initialize the controller', function() {
    stateParams.groupid = 1;
    stateParams.id = 1;
    scope.activeUser = user;
    spyOn(Roles, 'query').and.callThrough();
    spyOn(Users, 'get').and.callThrough();
    scope.init();
    expect(scope.data.data).toBeDefined();
    expect(scope.roles).toBeDefined();
    expect(Roles.query).toHaveBeenCalled();
    expect(Users.get).toHaveBeenCalled();
  });

  it('should initialize the controller to an error', function() {
    stateParams.groupid = 1;
    scope.activeUser = user;
    spyOn(Roles, 'query').and.callThrough();
    spyOn(Users, 'get').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    scope.init();
    expect(scope.data.data).not.toBeDefined();
    expect(scope.roles).toBeDefined();
    expect(Roles.query).toHaveBeenCalled();
    expect(Users.get).toHaveBeenCalled();
    expect(Utils.showAlert).toHaveBeenCalled();
  });

  it('should hide dialog forms', function() {
    spyOn(mdDialog, 'hide').and.callThrough();;
    scope.hide();
    expect(mdDialog.hide).toHaveBeenCalled();
  });

  it('should cancel dialog forms', function() {
    spyOn(mdDialog, 'cancel').and.callThrough();;
    scope.cancel();
    expect(mdDialog.cancel).toHaveBeenCalled();
  });

  it('should update user data', function() {
    spyOn(Users, 'update').and.callThrough();
    spyOn(Utils, 'showAlert').and.callThrough();
    stateParams.id = 1;
    scope.data = {};
    scope.activeUser = user;
    scope.update('ev');
    expect(Users.update).toHaveBeenCalled();
  });

});
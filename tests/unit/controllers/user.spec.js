(function() {
  'use strict';

  describe('UserCtrl tests', function() {

    var scope,

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

      Docs = {
        save: function(data, successCallback, errorCallback) {
          return data === 'new' ?
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

        bulkdelete: function(data, successCallback, errorCallback) {
          if (data.length > 0) {
            return successCallback(data);
          } else {
            return errorCallback(data);
          }
        },
      },

      Users = {
        save: function(data, successCallback, errorCallback) {
          return data ? successCallback(data) : errorCallback(false);
        },

        update: function(params, data, successCallback, errorCallback) {
          return (params.id && data) ?
            successCallback(data) : errorCallback(false);
        },

        count: function(successCallback) {
          return successCallback(null, 3);
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
      spyOn(Users, 'get').and.callThrough();
      scope.init();
      expect(scope.data.data).toBeDefined();
      expect(Users.get).toHaveBeenCalled();
    });

    it('should initialize the controller to an error', function() {
      stateParams.groupid = 1;
      scope.activeUser = user;
      spyOn(Users, 'get').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      scope.init();
      expect(scope.data.data).not.toBeDefined();
      expect(Users.get).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
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

})();

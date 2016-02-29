(function() {
  'use strict';

  describe('DocCtrl tests', function() {
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

      state,
      stateParams,
      Utils,

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

      controller;

    beforeEach(function() {
      module('prodocs');
    });


    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      controller = $controller('DocCtrl', {
        $scope: scope,
        Roles: Roles,
        Docs: Docs,
      });
      state = $injector.get('$state');
      Utils = $injector.get('Utils');
      stateParams = $injector.get('$stateParams');
      user = user;
    }));

    it('should initialize the controller', function() {
      spyOn(Roles, 'query').and.callThrough();
      stateParams.groupid = 1;
      scope.init();
      expect(scope.newDoc).toBeDefined();
      expect(scope.newDoc.roles).toBeDefined();
      expect(Roles.query).toHaveBeenCalled();
      expect(scope.roles).toBeDefined();
    });

    it('should load a valid document', function() {
      spyOn(Docs, 'get').and.callThrough();
      stateParams.docId = 1;
      scope.loadDoc();
      expect(Docs.get).toHaveBeenCalled();
      expect(scope.doc).toBeDefined();
    });

    it('should not load an invalid document', function() {
      spyOn(Docs, 'get').and.callThrough();
      stateParams.docId = false;
      scope.loadDoc();
      expect(Docs.get).toHaveBeenCalled();
      expect(scope.doc).not.toBeDefined();
    });

    it('should save a new document', function() {
      spyOn(Docs, 'save').and.callThrough();
      spyOn(state, 'go');
      scope.newDoc = 'new';
      scope.saveDoc('ev');
      expect(Docs.save).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
    });

    it('should not save a conflicting document', function() {
      spyOn(Docs, 'save').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      scope.newDoc = 'old';
      scope.saveDoc('ev');
      expect(Docs.save).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(state.go).not.toHaveBeenCalled();
    });


    it('should not save an invalid document', function() {
      spyOn(Docs, 'save').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      scope.newDoc = false;
      scope.saveDoc('ev');
      expect(Docs.save).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(state.go).not.toHaveBeenCalled();
    });

    it('should update a new document', function() {
      spyOn(Docs, 'update').and.callThrough();
      spyOn(state, 'go');
      scope.doc = 'new';
      stateParams.docId = 1;
      scope.updateDoc('ev');
      expect(Docs.update).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
    });

    it('should not update a conflicting document title', function() {
      spyOn(Docs, 'update').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      scope.doc = 'old';
      scope.updateDoc('ev');
      expect(Docs.update).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(state.go).not.toHaveBeenCalled();
    });


    it('should not update an invalid document', function() {
      spyOn(Docs, 'update').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      scope.doc = false;
      scope.updateDoc('ev');
      expect(Docs.update).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(state.go).not.toHaveBeenCalled();
    });

    it('should unselect a share role', function() {
      var list = ['Editor', ' Publisher'];
      var item = 'Editor';
      scope.toggle(item, list);
      expect(list.length).toBe(1);
    });

    it('should select a share role', function() {
      var list = ['Publisher'];
      var item = 'Editor';
      scope.toggle(item, list);
      expect(list.length).toBe(2);
    });

    it('should check a role', function() {
      scope.doc = {
        roles: [1, 2, 3]
      };
      var checked = scope.isSelected({
        _id: 2
      });
      expect(checked).toBeTruthy();
    });

    it('should cancel create/update document', function() {
      spyOn(state, 'go');
      scope.upState();
      expect(state.go).toHaveBeenCalled();
    });

  });

})();

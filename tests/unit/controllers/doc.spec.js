(function() {
  'use strict';

  describe('DocCtrl tests', function() {
    var scope,
      Roles = {
        save: function(data, cb, cbb) {
          return (data[0].title !== '') ? cb(data) : cbb(false);
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
          return params.groupid ?
            cb([{
              message: 'I am groot',
              data: [1, 3, 4]
            }]) : cbb('error');
        }
      },

      Docs = {
        save: function(data, cb, cbb) {
          if (data === 'new') {
            return cb(data);
          } else if (data === 'old') {
            return cbb({
              status: 409
            });
          } else {
            return cbb('error');
          }
        },
        update: function(params, data, cb, cbb) {
          if (params.id && data === 'new') {
            return cb(data);
          } else if (params.id && data === 'old') {
            return cbb({
              status: 409
            });
          } else {
            return cbb({
              status: 409
            });
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
        bulkDelete: function(arr, cb) {
          return (arr instanceof Array) ?
            cb(null) : cb('error');
        },
        query: function(cb) {
          if (cb) {
            return cb([{
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
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      scope.newDoc = 'new';
      scope.saveDoc('ev');
      expect(Docs.save).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
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
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      scope.doc = 'new';
      stateParams.docId = 1;
      scope.updateDoc('ev');
      expect(Docs.update).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
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

(function() {
  'use strict';

  describe('DocTableCtrl tests', function() {

    var scope, open,

      sampleDoc = {
        ownerId: [{
          name: {
            first: 'a',
            last: 'b'
          }
        }]
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
          if (params) {
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

        getUserDocs: function(id, params, cb) {
          return (id !== null && params !== null) ?
            cb(null, 'success') : cb('error');
        },
        getUserDocsCount: function(id, cb) {
          return id ? cb(null, 3) : cb(true);
        },
        getRoleDocs: function(id, params, cb) {
          return (id && params) ? cb(null, 'success') : cb('error');
        },
        getRoleDocsCount: function(id, cb) {
          return id ? cb(null, 3) : cb(true);
        },
      },

      Counts = {
        get: function(params, successCallback, errorCallback) {
          return (params.name) ?
            successCallback({
              count: 3
            }) : errorCallback(true);
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

      controller = $controller('DocTableCtrl', {
        $scope: scope,
        Docs: Docs,
        Counts: Counts
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


    describe('Initilization of the controller', function() {


      it('should initialize the controller', function() {
        spyOn(scope, 'getDocs');
        scope.init();
        expect(scope.query).toBeDefined();
        expect(scope.selectedDocs).toBeDefined();
        expect(scope.getDocs).toHaveBeenCalled();
      });

      describe('Get documents', function() {

        beforeEach(function() {
          scope.query = {
            page: 1,
            limit: 10
          };
        });


        it('should get documents based on state' +
          ' and valid stateParams - mydocs',
          function() {
            stateParams.id = 1;
            stateParams.groupid = 2;
            state.current.name = 'dashboard.list.mydocs';
            spyOn(Docs, 'getUserDocs').and.callThrough();
            spyOn(Docs, 'getUserDocsCount').and.callThrough();
            scope.getDocs(scope.query);
            expect(Docs.getUserDocs).toHaveBeenCalled();
            expect(Docs.getUserDocsCount).toHaveBeenCalled();
            expect(scope.docs).toBeDefined();
            expect(scope.count).toBeDefined();
          });


        it('should not get documents based on state and ' +
          'invalid stateParams - mydocs',
          function() {
            spyOn(Docs, 'getUserDocs').and.callThrough();
            spyOn(Docs, 'getUserDocsCount').and.callThrough();
            spyOn(Utils, 'showAlert').and.callThrough();
            stateParams.id = null;
            stateParams.groupid = 2;
            state.current.name = 'dashboard.list.mydocs';
            scope.getDocs(scope.query);
            expect(Docs.getUserDocs).toHaveBeenCalled();
            expect(Docs.getUserDocsCount).not.toHaveBeenCalled();
            expect(Utils.showAlert).toHaveBeenCalled();
            expect(scope.docs).not.toBeDefined();
            expect(scope.count).toBe(0);
          });

        it('should get documents count error - mydocs',
          function() {
            stateParams.groupid = 2;
            state.current.name = 'dashboard.list.mydocs';
            spyOn(Docs, 'getUserDocs').and.callThrough();
            spyOn(Docs, 'getUserDocsCount').and.callFake(function(id, cb) {
              return cb('error', null);
            });
            spyOn(Utils, 'showAlert').and.callThrough();
            scope.getDocs(scope.query);
            expect(Docs.getUserDocs).toHaveBeenCalled();
            expect(Utils.showAlert).toHaveBeenCalled();
            expect(scope.docs).toBeDefined();
            expect(scope.count).toBe(0);

          });

        it('should get documents based on state and ' +
          'valid stateParams - shared',
          function() {

            stateParams.roleid = 1;
            stateParams.groupid = 2;
            state.current.name = 'dashboard.list.shared';
            spyOn(Docs, 'getRoleDocs').and.callThrough();
            spyOn(Docs, 'getRoleDocsCount').and.callThrough();
            scope.getDocs(scope.query);
            expect(Docs.getRoleDocs).toHaveBeenCalled();
            expect(Docs.getRoleDocsCount).toHaveBeenCalled();
            expect(scope.docs).toBeDefined();
            expect(scope.count).toBeDefined();
          });

        it('should not get documents based on state and' +
          ' invalid stateParams - shared',
          function() {
            stateParams.groupid = 2;
            state.current.name = 'dashboard.list.shared';
            spyOn(Docs, 'getRoleDocs').and.callThrough();
            spyOn(Docs, 'getRoleDocsCount').and.callThrough();
            scope.getDocs(scope.query);
            expect(Docs.getRoleDocs).toHaveBeenCalled();
            expect(Docs.getRoleDocsCount).not.toHaveBeenCalled();
            expect(scope.docs).not.toBeDefined();
            expect(scope.count).toBe(0);
          });

        it('should get documents based on state - list', function() {
          stateParams.id = 1;
          stateParams.groupid = 2;
          state.current.name = 'dashboard.list';
          spyOn(Docs, 'query').and.callThrough();
          spyOn(Counts, 'get').and.callThrough();
          scope.getDocs(scope.query);
          expect(Docs.query).toHaveBeenCalled();
          expect(Counts.get).toHaveBeenCalled();
          expect(scope.docs).toBeDefined();
          expect(scope.count).toBe(3);
        });

        it('should return error getting documents' +
          ' based on state - list',
          function() {
            scope.query = null;
            stateParams.id = 1;
            stateParams.groupid = 2;
            state.current.name = 'dashboard.list';
            spyOn(Docs, 'query').and.callThrough();
            spyOn(Utils, 'showAlert').and.callThrough();
            scope.getDocs(scope.query);
            expect(Docs.query).toHaveBeenCalled();
            expect(Utils.showAlert).toHaveBeenCalled();
            expect(scope.docs).not.toBeDefined();
            expect(scope.count).toBe(0);
          });

        it('should load documents by pages', function() {
          spyOn(scope, 'getDocs').and.callThrough();
          scope.onPaginate(2, 1);
          expect(scope.selectedDocs.length).toBe(0);
          expect(scope.getDocs).toHaveBeenCalled();
        });
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
        expect(scope.access(doc)).toBeTruthy();
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
        expect(scope.access(doc)).toBeFalsy();
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

      it('should call scope edit functions', function() {
        spyOn(state, 'go');
        scope.menuAction('edit', 1, 'evt');
        expect(state.go).toHaveBeenCalledWith('dashboard.doc.edit', {
          docId: 1
        });
      });

      it('should call scope delete function', function() {
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(state, 'go');
        spyOn(Docs, 'delete').and.callThrough();
        scope.menuAction('delete', 1);
        expect(Docs.delete).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalled();
      });

      it('should alert delete error', function() {
        spyOn(Utils, 'showConfirm').and.callThrough();
        spyOn(state, 'go');
        spyOn(Docs, 'delete').and.callThrough();
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.menuAction('delete', null, 'evt');
        expect(Docs.delete).toHaveBeenCalled();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(Utils.showConfirm).toHaveBeenCalled();
        expect(state.go).not.toHaveBeenCalled();
      });

      it('should refresh the table', function() {
        spyOn(scope, 'getDocs');
        scope.refreshTable();
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

      describe('multiple selection for view and deletion', function() {
        it('show get multiple document id for view', function() {
          scope.selectedDocs = [1, 2, 3];
          spyOn(state, 'go').and.callThrough();
          scope.viewSelection();
          expect(state.go).toHaveBeenCalledWith('dashboard.doc.view', {
            docIds: [1, 2, 3],
            docId: 'id=1&id=2&id=3'
          });
        });

        it('shoulld delete a selection', function() {
          scope.selectedDocs = [1, 2];
          scope.docs = [{
            _id: 1
          }, {
            _id: 2
          }, {
            _id: 3
          }, {
            _id: 4
          }];
          spyOn(state, 'go').and.callThrough();
          spyOn(Utils, 'showConfirm').and.callThrough();
          spyOn(Docs, 'bulkdelete').and.callThrough();
          scope.deleteSelection();
          expect(Docs.bulkdelete).toHaveBeenCalled();
          expect(scope.selectedDocs.length).toBe(0);
          expect(state.go).toHaveBeenCalled();
          expect(scope.docs).toEqual([{
            _id: 3
          }, {
            _id: 4
          }]);
        });

        it('shoulld throw error deleting a selection', function() {
          scope.selectedDocs = [];
          scope.docs = [1, 2, 3, 4];
          spyOn(Utils, 'showConfirm').and.callThrough();
          spyOn(Utils, 'showAlert').and.callThrough();
          spyOn(Docs, 'bulkdelete').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          scope.deleteSelection();
          expect(Docs.bulkdelete).toHaveBeenCalled();
          expect(scope.selectedDocs.length).toBe(0);
          expect(Utils.showAlert).toHaveBeenCalled();
          expect(state.go).not.toHaveBeenCalled();
        });
      });
    });


  });

})();

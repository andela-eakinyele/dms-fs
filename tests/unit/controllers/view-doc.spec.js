(function() {
  'use strict';

  describe('ViewDocCtrl tests', function() {

    var scope,
      Docs = {
        save: function(data, cb, cbb) {
          return data ? cb(data) : cbb(false);
        },
        update: function(params, data, cb, cbb) {
          return (params.id && data) ? cb(data) : cbb(false);
        },
        delete: function(params, cb, cbb) {
          return (params.id) ? cb(true) : cbb(false);
        },
        get: function(params, cb, cbb) {
          return params.id ? cb({
            message: 'I am groot',
            data: [1, 3, 4]
          }) : cbb({
            message: 'error'
          });
        },
        query: function(cb) {
          return cb([{
            ownerId: [{
              name: {
                first: 'a',
                last: 'b'
              }
            }]
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

      timeout,
      state,
      stateParams,
      httpBackend,
      Utils,
      controller;
    beforeEach(function() {
      module('prodocs');
    });


    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      state = $injector.get('$state');
      controller = $controller('ViewDocCtrl', {
        $scope: scope,
        Docs: Docs,
        state: state
      });
      stateParams = $injector.get('$stateParams');
      Utils = $injector.get('Utils');
      timeout = $injector.get('$timeout');
      Utils.showConfirm = function(evt, title, action, msg, cb) {
        if (title === 'Delete') {
          return cb();
        }
      };
      httpBackend = $injector.get('$httpBackend');
      httpBackend
        .whenGET('views/dashboard.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/dashheader.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/dashsidenav.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/update.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('/api/session')
        .respond(400, {
          data: {
            message: 'User does not exist'
          }
        });

      httpBackend
        .whenGET('views/home.html')
        .respond(200, [{
          res: 'res'
        }]);


    }));


    describe('Initializing the controller', function() {
      beforeEach(function() {
        scope.$digest();
      });
      it('should initialize the controller and return a doc', function() {
        spyOn(Docs, 'get').and.callThrough();
        stateParams.docId = 1;
        scope.init();
        expect(Docs.get).toHaveBeenCalled();
        expect(scope.doc).toBeDefined();
      });

      it('should initialize the controller and return an error', function() {
        spyOn(Docs, 'get').and.callThrough();
        spyOn(state, 'go');
        spyOn(Utils, 'showAlert').and.callThrough();
        scope.init();
        expect(Docs.get).toHaveBeenCalled();
        expect(scope.doc).not.toBeDefined();
        expect(Utils.showAlert).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalled();
      });

      it('should watch fabisOpen scope variable', function() {
        scope.fabisOpen = false;
        scope.$digest();
        scope.fabisOpen = true;
        scope.$digest();
        expect(scope.tooltipVisible).toBeTruthy();
      });

    });

    it('should return parse time', function() {
      spyOn(Utils, 'parseDate').and.callThrough();
      var date = scope.getDate(Date.now());
      expect(date.day).toBeDefined();
      expect(date.time).toBeDefined();
    });

    it('should return true if dcoument is editable', function() {
      scope.activeUser = user;
      scope.doc = {
        ownerId: [{
          _id: 1
        }]
      };
      expect(scope.editDoc()).toBeTruthy();
    });

    it('should return false if dcoument is not editable', function() {
      scope.activeUser = user;
      scope.doc = {
        ownerId: [{
          _id: 2
        }]
      };
      expect(scope.editDoc()).toBeFalsy();
    });

    it('should activate menu action and got to edit dashboard', function() {
      spyOn(state, 'go');
      stateParams.docId = 1;
      scope.menuAction('edit');
      expect(state.go).toHaveBeenCalledWith('dashboard.doc.edit', {
        docId: 1
      });
    });

    it('should activate menu action and delete a file', function() {
      spyOn(Utils, 'showConfirm').and.callThrough();
      spyOn(Docs, 'delete').and.callThrough();
      spyOn(Utils, 'showAlert').and.callThrough();
      spyOn(state, 'go');
      stateParams.docId = 1;
      scope.menuAction('delete');
      expect(Docs.delete).toHaveBeenCalled();
      expect(Utils.showConfirm).toHaveBeenCalled();
      expect(Utils.showAlert).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
    });

  });

})();

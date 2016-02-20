(function() {
  'use strict';

  describe('Document Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Documents, cb,
      $resource, response, error,
      $http, httpBackend;

    beforeEach(inject(function($injector) {
      Documents = $injector.get('Docs');
      $resource = $injector.get('$resource');
      $http = $injector.get('$http');
      httpBackend = $injector.get('$httpBackend');

      cb = function(err, res) {
        if (err) {
          error = err;
          response = null;
        } else {
          error = null;
          response = res;
        }
      };

      httpBackend
        .whenGET('/api/session')
        .respond(200, {
          data: {
            user: {
              _id: 1,
              groupId: [{
                _id: 1
              }]
            },
            token: 'ertytyty'
          },
          group: 1
        });

      httpBackend
        .whenGET('views/home.html')
        .respond(200, [{
          res: 'res'
        }]);

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
        .whenGET('views/feature.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/table.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/group-table.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/register.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/group.html')
        .respond(200, [{
          res: 'res'
        }]);

      httpBackend
        .whenGET('views/home.html')
        .respond(200, [{
          res: 'res'
        }]);

    }));

    describe('Documents unit tests', function() {

      it('update should be a function', function() {
        spyOn(Documents, 'update').and.returnValue(745);
        Documents.update();
        expect(Documents.update).toBeDefined();
        expect(Documents.update).toHaveBeenCalled();
        expect(typeof Documents.update).toBe('function');
      });


      describe('custom request routes', function() {

        it('should get user documents only', function() {
          spyOn(Documents, 'getUserDocs').and.callThrough();

          httpBackend
            .whenGET('/api/users/1/documents')
            .respond(200, {
              data: [{
                _id: 1,
                content: 'I am a doc'
              }]
            });

          Documents.getUserDocs(1, cb);

          httpBackend.flush();

          expect(error).toBe(null);
          expect(response).toBeDefined();
        });

        it('should return error getting user documents only', function() {
          spyOn(Documents, 'getUserDocs').and.callThrough();

          httpBackend
            .whenGET('/api/users/1/documents')
            .respond(400, {
              err: 'err'
            });

          Documents.getUserDocs(1, cb);

          httpBackend.flush();

          expect(response).toBe(null);
          expect(error.data.err).toBe('err');
        });

        it('should get documents by role only', function() {
          spyOn(Documents, 'getRoleDocs').and.callThrough();

          httpBackend
            .whenGET('/api/roles/1/documents')
            .respond(200, {
              data: [{
                _id: 1,
                content: 'I am a doc'
              }]
            });

          Documents.getRoleDocs(1, cb);

          httpBackend.flush();

          expect(error).toBe(null);
          expect(response).toBeDefined();
        });

        it('should return error getting documents by role only', function() {
          spyOn(Documents, 'getRoleDocs').and.callThrough();

          httpBackend
            .whenGET('/api/roles/1/documents')
            .respond(400, {
              err: 'err'
            });

          Documents.getRoleDocs(1, cb);

          httpBackend.flush();

          expect(response).toBe(null);
          expect(error.data.err).toBe('err');
        });

        it('should delete selected documents', function() {
          spyOn(Documents, 'bulkdelete').and.callThrough();

          httpBackend
            .whenPOST('/api/documents/bulkdelete', [1, 2, 3])
            .respond(200, {
              data: true
            });

          Documents.bulkdelete([1, 2, 3], cb);

          httpBackend.flush();

          expect(error).toBe(null);
          expect(response).toBeTruthy();
        });

        it('should return error deleting documents', function() {
          spyOn(Documents, 'bulkdelete').and.callThrough();

          httpBackend
            .whenPOST('/api/documents/bulkdelete', [1, 2])
            .respond(400, true);
          Documents.bulkdelete([1, 2], cb);

          httpBackend.flush();

          expect(response).toBe(null);
          expect(error).toBeTruthy();
        });

        it('should get selected documents', function() {
          spyOn(Documents, 'bulkview').and.callThrough();

          httpBackend
            .whenPOST('/api/documents/bulkview', [1, 2, 3])
            .respond(200, {
              data: [1, 2, 3]
            });

          Documents.bulkview([1, 2, 3], cb);

          httpBackend.flush();

          expect(error).toBe(null);
          expect(response).toBeDefined();
        });

        it('should return error deleting documents', function() {
          spyOn(Documents, 'bulkview').and.callThrough();

          httpBackend
            .whenPOST('/api/documents/bulkview', [1, 2, 3])
            .respond(400, true);

          Documents.bulkview([1, 2, 3], cb);

          httpBackend.flush();

          expect(response).toBe(null);
          expect(error).toBeTruthy();
        });
      });

    });

  });

})();

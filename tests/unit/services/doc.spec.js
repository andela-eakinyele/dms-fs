(function() {
  'use strict';
  var a = /\/api\/users\/[0-9]*\/documents\?limit\=[0-9]*\&page\=[0-9]*/;
  var b = /\/api\/roles\/[0-9]*\/documents\?limit\=[0-9]*\&page\=[0-9]*/;

  describe('Document Service Test', function() {

    beforeEach(function() {
      module('prodocs');
    });

    var Documents, cb, params,
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

      params = {
        page: 1,
        limit: 10
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

        it('should get documents count', function() {

          spyOn(Documents, 'count').and.callThrough();

          httpBackend
            .whenGET('/api/documentcount')
            .respond(200, {
              data: 2
            });

          Documents.count(cb);

          httpBackend.flush();

          expect(error).toBe(null);
          expect(response).toBeDefined();
        });

        it('should return error getting documents count', function() {

          spyOn(Documents, 'count').and.callThrough();

          httpBackend
            .whenGET('/api/documentcount')
            .respond(400, {
              err: 'err'
            });

          Documents.count(cb);

          httpBackend.flush();

          expect(response).toBe(null);
          expect(error.data.err).toBe('err');
        });
      });


      describe('custom request routes', function() {

        describe('get user document and count only', function() {

          it('should get user documents', function() {
            spyOn(Documents, 'getUserDocs').and.callThrough();
            httpBackend
              .whenGET(a)
              .respond(200, {
                data: [{
                  _id: 1,
                  content: 'I am a doc'
                }]
              });

            Documents.getUserDocs(1, params, cb);

            httpBackend.flush();

            expect(error).toBe(null);
            expect(response).toBeDefined();
          });

          it('should return error getting user documents only', function() {
            spyOn(Documents, 'getUserDocs').and.callThrough();

            httpBackend
              .whenGET(a)
              .respond(400, {
                err: 'err'
              });

            Documents.getUserDocs(1, params, cb);

            httpBackend.flush();

            expect(response).toBe(null);
            expect(error.data.err).toBe('err');
          });

          it('should get user documents count', function() {
            spyOn(Documents, 'getUserDocsCount').and.callThrough();

            httpBackend
              .whenGET(/\/api\/users\/[0-9]*\/documents\/count/)
              .respond(200, {
                data: 2
              });

            Documents.getUserDocsCount(1, cb);

            httpBackend.flush();

            expect(error).toBe(null);
            expect(response).toBeDefined();
          });

          it('should return error getting user documents count', function() {
            spyOn(Documents, 'getUserDocsCount').and.callThrough();

            httpBackend
              .whenGET(/\/api\/users\/[0-9]*\/documents\/count/)
              .respond(400, {
                err: 'err'
              });

            Documents.getUserDocsCount(1, cb);

            httpBackend.flush();

            expect(response).toBe(null);
            expect(error.data.err).toBe('err');
          });
        });


        describe('getting document by role', function() {


          it('should get documents by role only', function() {
            spyOn(Documents, 'getRoleDocs').and.callThrough();

            httpBackend
              .whenGET(b)
              .respond(200, {
                data: [{
                  _id: 1,
                  content: 'I am a doc'
                }]
              });

            Documents.getRoleDocs(1, params, cb);

            httpBackend.flush();

            expect(error).toBe(null);
            expect(response).toBeDefined();
          });

          it('should return error getting documents by role', function() {
            spyOn(Documents, 'getRoleDocs').and.callThrough();

            httpBackend
              .whenGET(b)
              .respond(400, {
                err: 'err'
              });

            Documents.getRoleDocs(1, params, cb);

            httpBackend.flush();

            expect(response).toBe(null);
            expect(error.data.err).toBe('err');
          });

          it('should return documents by role count', function() {
            spyOn(Documents, 'getRoleDocsCount').and.callThrough();

            httpBackend
              .whenGET(/\/api\/roles\/[0-9]*\/documents\/count/)
              .respond(200, {
                data: 2
              });

            Documents.getRoleDocsCount(1, cb);

            httpBackend.flush();

            expect(error).toBe(null);
            expect(response).toBeDefined();
          });

          it('should return  error getting ' +
            'documents by role count',
            function() {
              spyOn(Documents, 'getRoleDocsCount').and.callThrough();

              httpBackend
                .whenGET(/\/api\/roles\/[0-9]*\/documents\/count/)
                .respond(400, {
                  err: 'err'
                });

              Documents.getRoleDocsCount(1, cb);

              httpBackend.flush();

              expect(response).toBe(null);
              expect(error.data.err).toBe('err');
            });
        });

        it('should delete selected documents', function() {
          spyOn(Documents, 'bulkdelete').and.callThrough();

          httpBackend
            .whenDELETE(/\/api\/documents\/bulkdelete\?ids\=([0-9]*,[0-9]*)*/)
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
            .whenDELETE(/\/api\/documents\/bulkdelete\?ids\=([0-9]*,[0-9]*)*/)
            .respond(400, true);
          Documents.bulkdelete([1, 2], cb);

          httpBackend.flush();

          expect(response).toBe(null);
          expect(error).toBeTruthy();
        });

        it('should get selected documents', function() {
          spyOn(Documents, 'bulkview').and.callThrough();

          httpBackend
            .whenGET(/\/api\/documents\/bulkview\?ids\=([0-9]*,[0-9]*)*/)
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
            .whenGET(/\/api\/documents\/bulkview\?ids\=([0-9]*,[0-9]*)*/)
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

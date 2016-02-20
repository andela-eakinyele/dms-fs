(function() {
  'use strict';

  describe('User Service', function() {

    var httpBackend,
      Users, cb,
      error, response;

    beforeEach(function() {
      module('prodocs');
    });

    // get your service, also get $httpBackend
    beforeEach(inject(function($injector) {
      Users = $injector.get('Users');
      httpBackend = $injector.get('$httpBackend');

      httpBackend
        .whenGET('views/dashboard.html')
        .respond(200, [{
          res: 'res'
        }]);
      httpBackend
        .whenGET('views/home.html')
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

      cb = function(err, res) {
        if (err) {
          error = err;
          response = null;
        } else {
          error = null;
          response = res;
        }
      };

    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    describe('Users login service', function() {

      beforeEach(function() {
        httpBackend
          .whenGET('/api/session')
          .respond(200, {
            data: {
              user: {
                _id: 1,
                groupId: [{
                  _id: 1
                }],
                roles: [{
                  _id: 1
                }]
              },
              token: 'ertytyty'
            },
            group: 1
          });
      });

      it('login should be a function', function() {
        expect(Users.login).toBeDefined();
        expect(typeof Users.login).toBe('function');
        httpBackend.flush();
      });

      it('should login a user', function() {
        httpBackend
          .whenPOST('/api/users/login')
          .respond(200, {
            res: 'res'
          });

        Users.login({
          userdata: 'user'
        }, cb);

        httpBackend.flush();

        expect(error).not.toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should not login a user', function() {
        httpBackend
          .whenPOST('/api/users/login')
          .respond(400, {
            err: 'err'
          });

        Users.login({
          userdata: 'user'
        }, cb);

        httpBackend.flush();

        expect(response).toBe(null);
        expect(error.data.err).toBe('err');
      });
    });

    describe('it should implement session', function() {

      beforeEach(function() {
        httpBackend
          .whenPOST('/api/users/login')
          .respond(200, {
            res: 'res'
          });

        httpBackend
          .whenGET('views/home.html')
          .respond(200, [{
            res: 'res'
          }]);

        httpBackend
          .whenGET('views/login.html')
          .respond(200, [{
            res: 'res'
          }]);

        httpBackend
          .whenGET('views/home.html')
          .respond(200, [{
            res: 'res'
          }]);

        httpBackend
          .whenGET('views/register.html')
          .respond(200, [{
            res: 'res'
          }]);
      });

      it('session should be a function', function() {
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

        Users.session(cb);

        httpBackend.flush();

        expect(Users.session).toBeDefined();
        expect(typeof Users.session).toBe('function');
      });

      it('should return a valid session response', function() {
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

        Users.session(cb);

        httpBackend.flush();

        expect(error).toBe(null);
        expect(response).toBeDefined();
      });

      it('should return a server error response', function() {
        httpBackend
          .whenGET('/api/session')
          .respond(500, {
            err: 'err'
          });

        Users.session(cb);

        httpBackend.flush();

        expect(response).toBe(null);
        expect(error.data.err).toBe('err');
      });

      it('should return an expired or InvalidToken', function() {
        httpBackend
          .whenGET('/api/session')
          .respond(400, {
            data: {
              message: 'Invalid Token'
            }
          });

        Users.session(cb);

        httpBackend.flush();

        expect(response).toBe(null);
        expect(error.data.data.message).toBeDefined();
      });

      it('should return an invalid or Deleted User', function() {
        httpBackend
          .whenGET('/api/session')
          .respond(400, {
            data: {
              message: 'User does not exist'
            }
          });

        Users.session(cb);

        httpBackend.flush();

        expect(response).toBe(null);
        expect(error.data.data.message).toBeDefined();
      });
    });

  });

})();

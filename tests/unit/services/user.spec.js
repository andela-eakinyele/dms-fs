describe('User Service', function() {
  var httpBackend,
    Users,
    error, response;
  beforeEach(function() {
    // load the module.
    module('prodocs');
  });

  // get your service, also get $httpBackend
  beforeEach(inject(function($injector) {
    Users = $injector.get('Users');
    httpBackend = $injector.get('$httpBackend');

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

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });


  describe('Users unit tests', function() {

    it('login should be a function', function() {
      expect(Users.login).toBeDefined();
      expect(typeof Users.login).toBe('function');
      httpBackend.flush();
    });

    it('should login a user', function() {

      httpBackend.when('POST', '/api/users/login').respond(200, {
        res: 'res'
      });
      Users.login({
        userdata: 'user'
      }, function(err, res) {
        if (err) {
          error = err;
          response = null;
        } else {
          err = null;
          response = res
        }
      });

      httpBackend.flush();
      expect(error).not.toBeDefined();
      expect(response.res).toBe('res');
    });
  });

});

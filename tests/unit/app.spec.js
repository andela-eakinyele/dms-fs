(function() {
  'use strict';

  describe('Application Run tests', function() {
    var scope,
      Users,
      res1 = {
        data: {
          user: {
            _id: 1,
            roles: [{}],
            groupId: [{
              _id: 1
            }]
          },
          token: 'token'
        },
        group: 1
      },

      res2 = {
        data: {
          user: {
            _id: 1,
            roles: [{

            }],
            groupId: []
          },
          token: 'token'
        },
        group: ''
      },

      res3 = {
        data: {
          user: {
            _id: 1,
            roles: [{
              _id: 1,
              title: 'superAdmin'
            }],
            groupId: []
          },
          token: 'token'
        },
        group: ''
      },

      res4 = {
        data: {
          error: 'err',
          message: 'Invalid Token'
        }
      },

      res5 = {
        data: {
          error: 'err',
          message: 'Invalid User'
        }
      },

      res6 = {
        data: {
          error: 'err',
          message: 'Error  Validating session'
        }
      },

      Auth = {
        isLoggedIn: function() {
          return true;
        },
        setToken: function(a, b) {
          return true;
        },
        logout: function() {
          return true;
        }
      },
      state = {
        go: function(name) {
          return name;
        }
      };

    describe('Application run', function() {

      describe('when token is valid', function() {

        it('should implement session and redirect to user dashboard', function() {

          Users = {
            session: function(cb) {
              cb(null, res1);
            }
          };

          spyOn(Auth, 'setToken').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(Users, 'session').and.callThrough();

          module('prodocs', function($provide) {
            $provide.value('Users', Users);
            $provide.value('Auth', Auth);
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          expect(Auth.setToken).toHaveBeenCalled();
          expect(Users.session).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('dashboard.list', {
            id: 1,
            groupid: 1
          });
        });

        it('should implement session and redirect to group', function() {
          Users = {
            session: function(cb) {
              cb(null, res2);
            }
          };

          spyOn(Auth, 'setToken').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(Users, 'session').and.callThrough();
          module('prodocs', function($provide) {
            $provide.value('Users', Users);
            $provide.value('Auth', Auth);
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          expect(Auth.setToken).toHaveBeenCalled();
          expect(Users.session).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('dashboard.group', {
            id: 1
          });
        });

        it('should implement session and redirect to admin', function() {
          Users = {
            session: function(cb) {
              cb(null, res3);
            }
          };

          spyOn(Auth, 'setToken').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(Users, 'session').and.callThrough();
          module('prodocs', function($provide) {
            $provide.value('Users', Users);
            $provide.value('Auth', Auth);
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          expect(Auth.setToken).toHaveBeenCalled();
          expect(Users.session).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('dashboard.admin.group', {
            id: 1
          });
        });

      });

      describe('When session is invalid', function() {

        it('should redirect to login page for expired token', function() {

          Users = {
            session: function(cb) {
              cb(res4, null);
            }
          };

          spyOn(Auth, 'setToken').and.callThrough();
          spyOn(Auth, 'logout').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(Users, 'session').and.callThrough();

          module('prodocs', function($provide) {
            $provide.value('Users', Users);
            $provide.value('Auth', Auth);
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          expect(Auth.setToken).not.toHaveBeenCalled();
          expect(Users.session).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('home.login');
          expect(Auth.logout).toHaveBeenCalled();
        });

        it('should redirect to signup for invalid user', function() {
          Users = {
            session: function(cb) {
              cb(res5, null);
            }
          };

          spyOn(Auth, 'setToken').and.callThrough();
          spyOn(Auth, 'logout').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(Users, 'session').and.callThrough();

          module('prodocs', function($provide) {
            $provide.value('Users', Users);
            $provide.value('Auth', Auth);
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          expect(Auth.setToken).not.toHaveBeenCalled();
          expect(Users.session).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('home.adduser');
          expect(Auth.logout).toHaveBeenCalled();
        });


        it('should redirect to signup for home page', function() {
          Users = {
            session: function(cb) {
              cb(res6, null);
            }
          };

          spyOn(Auth, 'setToken').and.callThrough();
          spyOn(Auth, 'logout').and.callThrough();
          spyOn(state, 'go').and.callThrough();
          spyOn(Users, 'session').and.callThrough();

          module('prodocs', function($provide) {
            $provide.value('Users', Users);
            $provide.value('Auth', Auth);
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          expect(Auth.setToken).not.toHaveBeenCalled();
          expect(Users.session).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('home.features');
          expect(Auth.logout).toHaveBeenCalled();
        });

      });

      describe('Testing previous state redirect', function() {


        it('should return to previous state on back click', function() {

          spyOn(state, 'go').and.callThrough();

          module('prodocs', function($provide) {
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          state.go('dashboard.admin.group');
          state.go('home.features')
          scope.back();
          expect(state.go).toHaveBeenCalledWith('dashboard.admin.group');
        });

        it('should return to previous state on back click', function() {

          spyOn(state, 'go').and.callThrough();

          module('prodocs', function($provide) {
            $provide.value('$state', state);
          });

          inject(function($injector) {
            scope = $injector.get('$rootScope');
          });

          state.go('home.login');
          scope.$digest();
          state.go('dashboard.admin.group')
          scope.back();
          expect(state.go).toHaveBeenCalledWith('home.features');
        });

      });


    });
  });

})();

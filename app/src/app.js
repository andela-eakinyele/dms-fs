(function() {
  'use strict';

  angular.module('prodocs.services', []);
  angular.module('prodocs.controllers', []);


  //Require Services
  require('./services/roles');
  require('./services/users');
  require('./services/docs');
  require('./services/auth');
  require('./services/group');
  require('./services/utils');
  require('./services/token');
  require('./services/token-injector');

  // Require Controllers
  require('./controllers/home');
  require('./controllers/features');
  require('./controllers/login');
  require('./controllers/register');
  require('./controllers/dashboard');
  require('./controllers/doc-table');
  require('./controllers/group');
  require('./controllers/admin-role');
  require('./controllers/user');
  require('./controllers/doc');
  require('./controllers/admin-table');
  require('./controllers/view-doc');

  window.app = angular.module('prodocs', [
    'prodocs.services',
    'prodocs.controllers',
    'ngRoute',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngMaterial',
    'md.data.table',
    'ui.tinymce',
    'ngSanitize',
    'ngAria',
    'ngAnimate'
  ])

  .config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
    '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
    function($stateProvider, $httpProvider, $urlRouterProvider,
      $locationProvider, $mdThemingProvider, $mdIconProvider) {

      $mdIconProvider.fontSet('fa', 'fontawesome');

      $httpProvider.interceptors.push('TokenInjector');

      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('light-blue');

      // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('home', { // route for home page
          abstract: true,
          url: '/',
          templateUrl: 'views/home.html',
          controller: 'StartPageCtrl'
        })

      .state('home.features', {
          url: '',
          views: {
            'feature@home': {
              templateUrl: 'views/feature.html',
              controller: 'FeatCtrl'
            },
          }
        })
        .state('home.adduser', {
          url: 'signup',
          views: {
            'nextView@home': {
              controller: 'SignupCtrl',
              templateUrl: 'views/register.html'
            }
          }
        })
        .state('home.login', {
          url: 'login',
          views: {
            'nextView@home': {
              controller: 'LoginCtrl',
              templateUrl: 'views/login.html'
            }
          }
        })
        .state('dashboard', {
          abstract: true,
          url: '/users/:id/dashboard/:groupid/documents',
          resolve: {
            activeUser: function($rootScope) {
              return $rootScope.activeUser;
            }
          },
          views: {
            '': {
              templateUrl: 'views/dashboard.html',
              controller: 'DashBoardCtrl'
            },
            'header@dashboard': {
              templateUrl: 'views/dashheader.html'
            },
            'sidenav@dashboard': {
              templateUrl: 'views/dashsidenav.html'
            },
            'profile@dashboard': {
              templateUrl: 'views/update.html',
              controller: 'UserCtrl'
            }
          }
        })
        .state('dashboard.group', {
          url: '^/users/:id/group',
          views: {
            'group@dashboard': {
              templateUrl: 'views/group.html',
              controller: 'GroupCtrl'
            }
          }
        })
        .state('dashboard.new', {
          url: '/new',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/new-doc.html',
              controller: 'DocCtrl'
            }
          }
        })
        .state('dashboard.list', {
          url: '/list',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/group-table.html',
              controller: 'DocTableCtrl'
            }
          }
        })

      .state('dashboard.list.mydocs', {
          url: '/mydocs',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/table.html',
              controller: 'DocTableCtrl'
            }
          }
        })
        .state('dashboard.list.shared', {
          url: '/shared/{roleid}',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/table.html',
              controller: 'DocTableCtrl'
            }
          }
        })
        .state('dashboard.doc', {
          abstract: true,
          url: '',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/dashdoc.html'
            },
          }
        })
        .state('dashboard.doc.view', {
          url: '/{docId}',
          views: {
            'docdata@dashboard.doc': {
              templateUrl: 'views/view-doc.html',
              controller: 'ViewDocCtrl'
            },
          },
          params: {
            docIds: []
          }
        })
        .state('dashboard.doc.edit', {
          url: '/:docId/edit',
          views: {
            'docdata@dashboard.doc': {
              templateUrl: 'views/edit-doc.html',
              controller: 'DocCtrl'
            },
          }
        })
        .state('dashboard.admin', {
          abstract: true,
          url: '^/users/:id/dashboard/admin',
          views: {
            'admin@dashboard': {
              templateUrl: 'views/admin.html'
            }
          },
          params: {
            query: {
              limit: 10,
              page: 1
            }
          }
        })
        .state('dashboard.admin.doc', {
          url: '/:groupid/documents',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-table-docs.html',
              controller: 'AdminTableCtrl'
            },
          }
        })
        .state('dashboard.admin.role', {
          url: '/:groupid/roles',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-table-roles.html',
              controller: 'AdminTableCtrl'
            },
          }
        })
        .state('dashboard.admin.viewuser', {
          url: '/:groupid/users',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-table-users.html',
              controller: 'AdminTableCtrl'
            },
          }
        })
        .state('dashboard.admin.role.add', {
          url: '/add',
          views: {
            'inner@dashboard.admin.role': {
              templateUrl: 'views/add-role.html',
              controller: 'AdminRoleCtrl'
            },
          }
        })
        .state('dashboard.admin.user', {
          url: '/users',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-users.html',
              controller: 'AdminTableCtrl'
            },
          }
        })
        .state('dashboard.admin.group', {
          url: '/groups',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-table-groups.html',
              controller: 'AdminTableCtrl'
            }
          }
        })
        .state('loginerror', {
          url: '/error',
          templateUrl: '',
          controller: ''
        });

      $locationProvider.html5Mode(true);
    }

  ])

  .run(['$rootScope', '$location', '$mdSidenav', '$state', 'Auth', 'Users',
    function($rootScope, $location, $mdSidenav, $state, Auth, Users) {


      // side navigation bar control
      $rootScope.openSideNav = function(dir) {
        $mdSidenav(dir).toggle();
      };

      $rootScope.close = function(dir) {
        $mdSidenav(dir).close();
      };

      // previous state handling
      $rootScope.previousState = {};

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams,
        fromState, fromParams) {
        // store previous state in $rootScope
        $rootScope.previousState.name = fromState.name;
        $rootScope.previousState.params = fromParams;
      });

      //back button function called from back button's ng-click="back()"
      $rootScope.back = function() {
        if (/dashboard/.test($rootScope.previousState.name)) {
          $state.go($rootScope.previousState.name,
            $rootScope.previousState.params);
        } else {
          $state.go('home.features');
        }
      };


      if (!Auth.isLoggedIn()) {

        $state.go('home.features');

      } else {

        // Check if the user's session is still being persisted in the servers
        Users.session(function(err, res) {
          if (!err) {
            $rootScope.activeUser = res.data.user;

            // check for group 
            if (res.group === '' && res.data.user.groupId.length === 0) {
              Auth.setToken(JSON.stringify(res.data), '');
            } else {
              $rootScope.activeGroup = (res.group === '') ?
                res.data.user.groupId[0]._id : res.group;
              Auth.setToken(JSON.stringify(res.data), $rootScope.activeGroup);
            }

            //check for superAdmin user
            var superAdmin = window._
              .filter(res.data.user.roles, {
                'title': 'superAdmin'
              });

            if (superAdmin.length > 0) {
              $state.go('dashboard.admin.group', {
                id: res.data.user._id
              });
            } else {
              // check if user belongs to a group
              if (!res.group && res.data.user.groupId.length === 0) {
                $state.go('dashboard.group', {
                  id: res.data.user._id
                });

                // use user group or last set header group
              } else {
                $state.go('dashboard.list', {
                  id: res.data.user._id,
                  groupid: $rootScope.activeGroup
                });
              }
            }
          } else {
            if (/Token/.test(err.data.message)) {
              Auth.logout();
              $state.go('home.login');
            } else if (/User/.test(err.data.message)) {
              Auth.logout();
              $state.go('home.adduser');
            } else {
              Auth.logout();
              $state.go('home.features');
            }
          }
        });

      }

    }
  ]);


})();

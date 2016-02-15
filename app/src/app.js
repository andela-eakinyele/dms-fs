(function() {
  'use strict';

  angular.module('prodocs.controllers', []);
  angular.module('prodocs.services', []);

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
  require('./controllers/table');
  require('./controllers/group');
  require('./controllers/admin-role');
  require('./controllers/user');
  require('./controllers/doc');
  require('./controllers/list');
  require('./controllers/view-doc');

  window.app = angular.module('prodocs', [
    'prodocs.controllers',
    'prodocs.services',
    'ngRoute',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngMaterial',
    'md.data.table',
    'ui.grid',
    'ui.grid.pagination',
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
          url: '/prodocs',
          templateUrl: 'views/home.html',
          controller: 'StartPageCtrl'
        })

      .state('home.features', {
          url: '',
          views: {
            'feature@home': {
              templateUrl: 'views/feature.html',
              controller: 'featCtrl'
            },
          }
        })
        .state('home.group', {
          url: '/users/:id/group',
          views: {
            'nextView@home': {
              templateUrl: 'views/group.html',
              controller: 'GroupCtrl'
            }
          }
        })
        .state('home.adduser', {
          url: '/newuser',
          views: {
            'nextView@home': {
              controller: 'SignupCtrl',
              templateUrl: 'views/register.html'
            }
          }
        })
        .state('home.login', {
          url: '/login',
          views: {
            'nextView@home': {
              controller: 'LoginCtrl',
              templateUrl: 'views/login.html'
            }
          }
        })
        .state('dashboard', {
          abstract: true,
          url: '/prodocs/users/:id/dashboard/:groupid/documents',
          views: {
            '': {
              templateUrl: 'views/dashboard.html',
              resolve: {
                'activeUser': ['$rootScope', function($rootScope) {
                  return $rootScope.activeUser;
                }],
                'activeGroup': ['$rootScope', function($rootScope) {
                  return $rootScope.activeGroup;
                }]
              },
              controller: 'DashBoardCtrl'
            },
            'header@dashboard': {
              templateUrl: 'views/dashheader.html'
            },
            'sidenav@dashboard': {
              templateUrl: 'views/dashsidenav.html'
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
              controller: 'tableCtrl'
            }
          }
        })

      .state('dashboard.list.mydocs', {
          url: '/mydocs',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/table.html',
              controller: 'tableCtrl'
            }
          }
        })
        .state('dashboard.list.shared', {
          url: '/shared/{roleid}',
          views: {
            'inner@dashboard': {
              templateUrl: 'views/table.html',
              controller: 'tableCtrl'
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
          url: '/:docId',
          views: {
            'docdata@dashboard.doc': {
              templateUrl: 'views/view-doc.html',
              controller: 'ViewDocCtrl'
            },
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
          url: '^/prodocs/users/:id/dashboard/admin',
          views: {
            'add@dashboard': {
              templateUrl: 'views/admin.html'
            },
          }
        })
        .state('dashboard.admin.viewdoc', {
          url: '/:groupid/documents/list',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-list-docs.html',
              controller: 'AdminListCtrl'
            },
          }
        })
        .state('dashboard.admin.viewrole', {
          url: '/:groupid/roles/list',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-list-roles.html',
              controller: 'AdminListCtrl'
            },
          }
        })
        .state('dashboard.admin.viewuser', {
          url: '/:groupid/users',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-list-users.html',
              controller: 'AdminListCtrl'
            },
          }
        })
        .state('dashboard.admin.role', {
          url: '/:groupid/roles',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/admin-role.html',
              controller: 'AdminRoleCtrl'
            },
          }
        })
        .state('dashboard.admin.user', {
          url: '/users',
          views: {
            'inner@dashboard.admin': {
              templateUrl: 'views/add-user.html',
              resolve: {
                'activeUser': ['$rootScope', function($rootScope) {
                  return $rootScope.activeUser;
                }],
                'activeGroup': ['$rootScope', function($rootScope) {
                  return $rootScope.activeGroup;
                }]
              }
              // controller: 'AdminCtrl'
            },
          }
        })
        .state('loginerror', {
          url: '/prodocs/error',
          templateUrl: '',
          controller: ''
        });

      $locationProvider.html5Mode(true);
    }

  ])

  .run(['$rootScope', '$location', '$state', 'Auth', 'Users',
    function($rootScope, $location, $state, Auth, Users) {

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
        if ($rootScope.previousState.name === 'dashboard') {
          $state.go($rootScope.previousState.name,
            $rootScope.previousState.params);
        } else {
          $state.go('home.features');
        }
      };

      // Check if the user's session is still being persisted in the servers
      Users.session(function(err, res) {
        if (!err) {
          // response with expired or invalid token
          if (!res || res.error) {
            $state.go('home.login');
            // response with valid renewed token
          } else {
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
            var Admin = window._
              .filter(res.data.user.roles, { 'title': 'Admin' });

            if (Admin.length > 0) {
              $state.go('dashboard.admin.viewdoc', {
                id: res.data.user._id,
                groupid: $rootScope.activeGroup
              });

              // not admin user
            } else {
              if (!res.group && res.data.user.groupId.length === 0) {
                $state.go('home.group', {
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
          }
        }
      });

    }
  ]);


})();

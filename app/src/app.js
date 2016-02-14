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




  window.app = angular.module('prodocs', [
    'prodocs.controllers',
    'prodocs.services',
    'ngRoute',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngMaterial',
    'ngAria',
    'ngAnimate'
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
            if (res.error) {
              $state.go('home.login');
            } else { // response with valid renewed token
              if ($rootScope.activeUser) {
                $state.go($state.current.name);
              } else {
                $rootScope.activeUser = res.user;
                Auth.setToken(JSON.stringify(res));
                if (res.user.groupId[0]) {
                  $rootScope.activeGroup = res.user.groupId[0];
                  $state.go('dashboard.list', {
                    id: res.user._id,
                    groupid: res.user.groupId[0]._id
                  });
                } else {
                  var superAdmin = window._.map(res.user.roles, 'title');
                  if (superAdmin.length > 0) {
                    $state.go('dashboard.admin', {
                      id: res.user._id
                    });
                  } else {
                    $state.go('home.group', {
                      id: res.user._id
                    });
                  }
                }
              }
            }
          } else {
            $state.reload();
          }
        });

      }
    ])
    .config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
      '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
      function($stateProvider, $httpProvider, $urlRouterProvider,
        $locationProvider, $mdThemingProvider, $mdIconProvider) {

        $mdIconProvider.fontSet('fa', 'fontawesome');

        $httpProvider.interceptors.push('TokenInjector');

        $mdThemingProvider.theme('default')
          .primaryPalette('cyan')
          .accentPalette('orange');

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
                templateUrl: 'views/table.html',
                controller: 'tableCtrl'
              }
            }
          })
          .state('dashboard.doc', {
            url: '/:docId',
            views: {
              'inner@dashboard': {
                templateUrl: 'views/dashdoc.html'
              },
            }
          })
          .state('dashboard.admin', {
            url: '^/prodocs/users/:id/dashboard/admin',
            views: {
              'add@dashboard': {
                templateUrl: 'views/admin.html'
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

    ]);


})();

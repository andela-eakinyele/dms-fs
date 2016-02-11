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
  require('./controllers/admin');


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
          console.log($rootScope.previousState.name);
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
            if (res.error) {
              if (!$rootScope.activeUser) {
                $state.go('home.features');
              } else {
                $state.go('home.login');
              }
            } else {
              $rootScope.activeUser = res.user;
              $rootScope.group = res.user.groupId;
              Auth.setToken(JSON.stringify(res));
              $state.go('dashboard', {
                id: res.user._id,
                groupid: res.user.groupId[0]._id
              });
            }
          } else {
            if (!$rootScope.activeUser) {
              $state.go('home.features');
            } else {
              $state.go('home.login');
            }
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


        var RedMap = $mdThemingProvider.extendPalette('blue', {
          '500': '5D518E'
        });


        $mdThemingProvider.definePalette('dmsPalette', RedMap);


        $mdThemingProvider.theme('default')
          .primaryPalette('dmsPalette');

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
                templateUrl: 'views/doc.html',
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
            url: '/:id',
            views: {
              'inner@dashboard': {
                templateUrl: 'views/dashdoc.html',
                controller: 'docCtrl'
              },
            }
          })
          .state('dashboard.role', {
            url: '/admin/roles',
            views: {
              'add@dashboard': {
                templateUrl: 'views/add-role.html',
                controller: 'AdminCtrl'
              },
            }
          })
          .state('dashboard.user', {
            url: '/admin/users',
            views: {
              'add@dashboard': {
                templateUrl: 'views/add-user.html',
                controller: 'AdminCtrl'
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

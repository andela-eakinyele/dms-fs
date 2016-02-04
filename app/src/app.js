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


  .config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
    '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
    function($stateProvider, $httpProvider, $urlRouterProvider,
      $locationProvider, $mdThemingProvider, $mdIconProvider) {

      $mdIconProvider.fontSet('fa', 'fontawesome');

      $httpProvider.interceptors.push('TokenInjector');


      var RedMap = $mdThemingProvider.extendPalette('blue', {
        '500': '014D9A'
      });


      $mdThemingProvider.definePalette('dmsPalette', RedMap);


      $mdThemingProvider.theme('default')
        .primaryPalette('dmsPalette')
        .accentPalette('indigo');


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
          url: '/prodocs/users/:userId/dashboard/:groupId/documents',
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
              // controller: 'docCtrl'
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

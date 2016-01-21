(function() {
  'use strict';

  angular.module('prodocs.controllers', []);
  angular.module('prodocs.services', []);

  //Require Services
  require('./services/roles');
  require('./services/users');
  require('./services/docs');
  require('./services/auth');
  require('./services/project');

  require('./services/token');
  require('./services/token-injector');


  // Require Controllers
  require('./controllers/welcome');
  require('./controllers/login');
  require('./controllers/register');
  require('./controllers/dashboard');
  require('./controllers/project');



  window.app = angular.module('prodocs', [
    'prodocs.controllers',
    'prodocs.services',
    'ngRoute',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngMaterial'
  ]);

  window.app.config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
    '$locationProvider', '$mdThemingProvider',
    function($stateProvider, $httpProvider, $urlRouterProvider,
      $locationProvider, $mdThemingProvider) {

      $httpProvider.interceptors.push('TokenInjector');


      var RedMap = $mdThemingProvider.extendPalette('teal', {
        '500': 'd61e1e'
      });

      $mdThemingProvider.definePalette('dmsPalette', RedMap);

      $mdThemingProvider.theme('default')
        .primaryPalette('dmsPalette');

      // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('home', { // route for home page
          url: '/prodocs',
          templateUrl: 'views/welcome.html',
          controller: 'StartPageCtrl'
        })

      .state('home.adduser', {
          url: '/newuser',
          views: {
            'a@home': {
              controller: 'SignupCtrl',
              templateUrl: 'views/register.html'
            }
          }
        })
        .state('home.login', {
          url: '/login',
          views: {
            'b@home': {
              controller: 'LoginCtrl',
              templateUrl: 'views/login.html'
            }
          }
        })
        .state('home.project', {
          url: '/project',
          views: {
            'c@home': {
              controller: 'ProjectCtrl',
              templateUrl: 'views/projectDetails.html'
            }
          }
        })
        .state('dashboard', {
          url: '/andela/prodocs/{projectId}/dashboard',
          templateUrl: 'views/dashboard.html',
          controller: 'DashBoardCtrl'
        })
        .state('loginerror', {
          url: '/andela/prodocs/error',
          templateUrl: '',
          controller: ''
        });

      $locationProvider.html5Mode(true);
    }

  ]);


})();

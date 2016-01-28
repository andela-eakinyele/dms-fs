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
    'ngMaterial',
    'ngAria',
    'ngAnimate'
  ]);

  window.app.config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
    '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
    function($stateProvider, $httpProvider, $urlRouterProvider,
      $locationProvider, $mdThemingProvider, $mdIconProvider) {

      $mdIconProvider.fontSet('fa', 'fontawesome')
        .defaultIconSet('./assets/mdi.svg', 128)
        .icon('menu', './assets/assets.svg', 24);
      // .icon('share', './assets/svg/share.svg', 24)
      // .icon('google_plus', './assets/svg/google_plus.svg', 512)
      // .icon('hangouts', './assets/svg/hangouts.svg', 512)
      // .icon('twitter', './assets/svg/twitter.svg', 512)
      // .icon('phone', './assets/svg/phone.svg', 512);

      $httpProvider.interceptors.push('TokenInjector');


      var RedMap = $mdThemingProvider.extendPalette('blue', {
        '500': 'D65233'
      });



      $mdThemingProvider.definePalette('dmsPalette', RedMap);


      $mdThemingProvider.theme('default')
        .primaryPalette('orange')
        .accentPalette('indigo');


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
          url: '/prodocs/{projectId}/dashboard',
          templateUrl: 'views/dashboard.html',
          controller: 'DashBoardCtrl'
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

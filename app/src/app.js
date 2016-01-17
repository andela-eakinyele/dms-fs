(function() {
  'use strict';

  angular.module('prodocs.controllers', []);
  angular.module('prodocs.services', []);

  //Require Services
  require('./services/roles');
  require('./services/users');
  require('./services/docs');

  // Require Controllers
  require('./controllers/welcome');

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


      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('pink');


      // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('home', { // route for home page
          url: '/',
          templateUrl: 'views/welcome.html',
          controller: 'StartPageCtrl'
        })

      .state('home.adduser', {
        url: 'newuser',
        views: {
          'inner-view@home': {
            controller: 'StartPageCtrl',
            templateUrl: 'views/register.html'
          },
        }
      });

      $locationProvider.html5Mode(true);
    }

  ]);


})();

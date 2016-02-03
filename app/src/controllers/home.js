(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('StartPageCtrl', ['$mdMedia', '$rootScope', '$scope',
      '$state', '$timeout',
      function($mdMedia, $rootScope, $scope, $state, $timeout) {
        $scope.showButton = true;

        // $timeout(function() {
          $scope.$watch(function() {
            return $state.current.name;
          }, function(name) {
            if (name === 'home.features') {
              $scope.showButton = true;
            } else {
              $scope.showButton = false;
            }
          });
        // }, 0.5);
      }
    ]);
})();

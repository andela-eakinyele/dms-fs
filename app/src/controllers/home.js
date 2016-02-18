(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('StartPageCtrl', ['$rootScope', '$scope',
      '$state',
      function(rootScope, $scope, $state) {
        $scope.showButton = true;

        $scope.$watch(function() {
          return $state.current.name;
        }, function(name) {
          if (name === 'home.features') {
            $scope.showButton = true;
          } else {
            $scope.showButton = false;
          }
        });

      }
    ]);
})();

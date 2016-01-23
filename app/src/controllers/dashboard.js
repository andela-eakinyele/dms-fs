(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$rootScope', '$scope', '$mdMedia',
      function($rootScope, $scope, $mdMedia) {

        $scope.$watch(function() {
          return $mdMedia('gt-sm');
        }, function(big) {
          $scope.bigScreen = big;
        });

      }
    ]);
})();

(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DocsCtrl', ['$scope', '$mdMedia',
      '$timeout', 'Docs',
      function($scope, $mdMedia, $timeout, Docs) {
        $scope.status = '';
        $scope.fullScreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });

      }

    ]);
})();
